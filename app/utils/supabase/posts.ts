import { PostgrestError, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/extended-database.types";
import { generateExcerpt } from "@/utils/post";
import type {
  Post,
  PostBulkFailure,
  PostFile,
  PostInsertType,
  PostNeighbors,
  PostSaveResult,
  PostStorageFile,
  PostStorageFiles,
  PostUpdateFile,
  PostUpdateType,
  SimplePost,
  SimplePostWithMenuSlug,
  SimpleTempPost,
  TempPost,
} from "@/types/supabase";

export const POST_VISIBILITIES = ["all", "public", "private"] as const;
export type PostVisibility = (typeof POST_VISIBILITIES)[number];

const POST = "posts" as const;
const TEMP_POST = "temp_posts" as const;
const INLINE = "inline" as const;
const ATTACHMENTS = "attachments" as const;

export interface GetPostListParams {
  page: number;
  perPage: number;
  slugs?: string[];
  query?: string;
  visibility?: PostVisibility;
}

const LIST_COLUMNS =
  "id, title, created_at, menu_id, hidden, thumbnail, excerpt" as const;

// menus를 항상 inner join 한다.
// 비로그인 사용자에게는 menus RLS(hidden=false)로 숨김 메뉴 행이 보이지 않으므로,
// inner join이 그 메뉴에 속한 게시글까지 함께 제외해준다.
const LIST_SELECT_COLUMNS = `${LIST_COLUMNS}, menus!inner(slug)` as const;

type PostRowWithMenuSlug = SimplePost & { menus: { slug: string } };

export type PostsGetById = {
  (id: number, temp: true): Promise<TempPost>;
  (id: number, temp?: false): Promise<Post>;
  (id: number, temp: boolean): Promise<Post | TempPost>;
};

export type PostsApi = {
  getList: (
    params: GetPostListParams
  ) => Promise<{ data: SimplePostWithMenuSlug[]; count: number }>;
  getTempList: () => Promise<{ data: SimpleTempPost[]; count: number }>;
  create: (
    formData: PostInsertType,
    files: PostFile,
    temp?: boolean
  ) => Promise<PostSaveResult>;
  getById: PostsGetById;
  getFiles: (postId: number, temp?: boolean) => Promise<PostStorageFiles>;
  update: (
    formData: PostUpdateType,
    files: PostUpdateFile,
    temp?: boolean
  ) => Promise<PostSaveResult>;
  delete: (id: number, temp?: boolean) => Promise<number>;
  publishFromTemp: (
    tempId: number,
    formData: PostInsertType,
    files: PostUpdateFile
  ) => Promise<PostSaveResult>;
  bulkDelete: (postIds: number[]) => Promise<PostBulkFailure[]>;
  getPostNeighbors: (postId: number) => Promise<PostNeighbors | null>;
};

// 정규식 특수문자 이스케이프 (data-inline-key 값을 정규식 리터럴로 사용하기 위함)
const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// 본문(HTML) 안의 inline 이미지 <img> 태그를 찾아 src를 업로드된 publicUrl로 치환
// data-inline-key로 매칭하므로 key -> url 매핑에 없는 이미지는 스킵
const replaceInlineImageUrls = (
  html: string,
  urlByKey: Record<string, string>
): string =>
  Object.entries(urlByKey).reduce((acc, [key, url]) => {
    const tagPattern = new RegExp(
      `<img\\b[^>]*data-inline-key=["']${escapeRegExp(key)}["'][^>]*>`,
      "gi"
    );
    return acc.replace(tagPattern, (tag) =>
      /src=["'][^"']*["']/i.test(tag)
        ? tag.replace(/src=["'][^"']*["']/i, `src="${url}"`)
        : tag.replace(/<img/i, `<img src="${url}"`)
    );
  }, html);

// 본문(HTML) 안에서 특정 data-inline-key를 가진 이미지의 현재 src를 찾음
// (신규/기존 이미지 모두 본문에 실제 url이 반영돼 있으므로 key -> url 조회에 사용)
const findInlineImageSrc = (html: string, key: string): string | null => {
  const tagPattern = new RegExp(
    `<img\\b[^>]*data-inline-key=["']${escapeRegExp(key)}["'][^>]*>`,
    "i"
  );
  const tag = html.match(tagPattern)?.[0];
  if (!tag) return null;

  return tag.match(/src=["']([^"']*)["']/i)?.[1] ?? null;
};

// 본문(HTML) 안에서 현재 사용 중인 모든 inline 이미지의 data-inline-key 값을 추출
const extractInlineImageKeys = (html: string): Set<string> => {
  const keys = new Set<string>();
  for (const match of html.matchAll(/data-inline-key=["']([^"']+)["']/gi)) {
    if (match[1]) keys.add(match[1]);
  }
  return keys;
};

// 스토리지 폴더 안에서 keepKeys에 포함되지 않은(더 이상 쓰이지 않는) 파일의 경로를 찾음
const listStalePaths = async (
  client: SupabaseClient<Database>,
  bucket: string,
  folderPath: string,
  keepKeys: Set<string>
): Promise<string[]> => {
  const { data, error } = await client.storage.from(bucket).list(folderPath);
  if (error) throw error;

  return (data ?? [])
    .filter((file) => !keepKeys.has(file.name))
    .map((file) => `${folderPath}/${file.name}`);
};

// 스토리지 폴더의 파일 목록을 PostStorageFile[]로 변환
const listStorageFiles = async (
  client: SupabaseClient<Database>,
  bucket: string,
  folderPath: string
): Promise<PostStorageFile[]> => {
  const { data, error } = await client.storage.from(bucket).list(folderPath);
  if (error) throw error;

  return (data ?? []).map((file) => {
    const path = `${folderPath}/${file.name}`;
    return {
      key: file.name,
      path,
      size: file.metadata?.size as number | undefined,
      url: client.storage.from(bucket).getPublicUrl(path).data.publicUrl,
    };
  });
};

// 게시글에 연결된 스토리지 파일(inline 이미지, 첨부파일)을 전부 삭제
const removePostFiles = async (
  client: SupabaseClient<Database>,
  dbName: string,
  postId: number
): Promise<void> => {
  const [inlinePaths, attachmentPaths] = await Promise.all([
    listStalePaths(client, dbName, `${postId}/${INLINE}`, new Set()),
    listStalePaths(client, dbName, `${postId}/${ATTACHMENTS}`, new Set()),
  ]);
  const paths = [...inlinePaths, ...attachmentPaths];
  if (!paths.length) return;

  const { error } = await client.storage.from(dbName).remove(paths);
  if (error) throw error;
};

export const posts = (client: SupabaseClient<Database>): PostsApi => {
  async function getById(id: number, temp: true): Promise<TempPost>;
  async function getById(id: number, temp?: false): Promise<Post>;
  async function getById(id: number, temp?: boolean): Promise<Post | TempPost>;
  async function getById(id: number, temp: boolean = false) {
    const table = temp ? TEMP_POST : POST;

    const { data, error } = await client
      .from(table)
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new PostgrestError(error);

    return data;
  }

  const create = async (
    formData: PostInsertType,
    files: PostFile,
    temp: boolean = false
  ): Promise<PostSaveResult> => {
    // 테이블, 버켓 이름
    const dbName = temp ? TEMP_POST : POST;

    // 1. postId를 미리 받아옴 (본문/스토리지 경로에 사용)
    const { data: postId, error: postIdError } = await client.rpc(
      `reserve_${temp ? "temp_" : ""}post_id`
    );
    if (postIdError) throw new PostgrestError(postIdError);

    // 실패 시 롤백을 위해 업로드에 성공한 스토리지 경로를 기록
    const uploadedPaths: string[] = [];

    const uploadFile = async (
      folder: typeof INLINE | typeof ATTACHMENTS,
      key: string,
      file: File
    ) => {
      const path = `${postId}/${folder}/${key}`;
      const { error } = await client.storage.from(dbName).upload(path, file);
      if (error) throw error;
      uploadedPaths.push(path);

      return client.storage.from(dbName).getPublicUrl(path).data.publicUrl;
    };

    try {
      // 2. 이미지와 첨부파일을 미리 업로드해서 publicUrl을 받음
      const inlineUrlByKey: Record<string, string> = {};
      for (const [key, file] of Object.entries(files.inlineImages)) {
        inlineUrlByKey[key] = await uploadFile(INLINE, key, file);
      }
      for (const [key, file] of Object.entries(files.attachments)) {
        await uploadFile(ATTACHMENTS, key, file);
      }

      // 3. inline image의 url을 publicUrl로 변경
      const content = replaceInlineImageUrls(formData.content, inlineUrlByKey);

      // 업로드된 publicUrl로 썸네일 경로 변경
      const thumbnail = formData.thumbnail
        ? (findInlineImageSrc(content, formData.thumbnail) ??
          formData.thumbnail)
        : formData.thumbnail;

      // 4. 게시글을 테이블에 업로드
      const baseRow = {
        id: postId,
        content,
        thumbnail,
        hidden: formData.hidden,
        menu_id: formData.menu_id,
        tags: formData.tags,
        title: formData.title,
      };

      const { error: postInsertError } = temp
        ? await client.from(TEMP_POST).insert(baseRow)
        : await client.from(POST).insert({
            ...baseRow,
            excerpt: generateExcerpt(content),
          });
      if (postInsertError) throw new PostgrestError(postInsertError);

      const attachments = await listStorageFiles(
        client,
        dbName,
        `${postId}/${ATTACHMENTS}`
      );

      return { id: postId, content, thumbnail, attachments };
    } catch (error) {
      // 위 과정 중 하나라도 실패하면 이미 업로드된 파일을 모두 삭제
      if (uploadedPaths.length) {
        await client.storage.from(dbName).remove(uploadedPaths);
      }
      throw error;
    }
  };

  const update = async (
    formData: PostUpdateType,
    files: PostUpdateFile,
    temp: boolean = false
  ): Promise<PostSaveResult> => {
    // 테이블, 버켓 이름
    const dbName = temp ? TEMP_POST : POST;
    const postId = formData.id;

    // 실패 시 롤백을 위해 새로 업로드에 성공한 스토리지 경로를 기록
    // (기존 파일은 이 시점에 건드리지 않으므로 롤백 대상에서 제외)
    const uploadedPaths: string[] = [];

    // 이미 스토리지에 있는 key는 재업로드하지 않음 (이전 임시저장 등)
    const [existingInlineFiles, existingAttachmentFiles] = await Promise.all([
      listStorageFiles(client, dbName, `${postId}/${INLINE}`),
      listStorageFiles(client, dbName, `${postId}/${ATTACHMENTS}`),
    ]);
    const existingInlineKeys = new Set(
      existingInlineFiles.map((file) => file.key)
    );
    const existingAttachmentKeys = new Set(
      existingAttachmentFiles.map((file) => file.key)
    );

    const uploadFile = async (
      folder: typeof INLINE | typeof ATTACHMENTS,
      key: string,
      file: File
    ) => {
      const path = `${postId}/${folder}/${key}`;
      const existingKeys =
        folder === INLINE ? existingInlineKeys : existingAttachmentKeys;

      // 이미 저장된 key면 업로드를 건너뛰고 publicUrl만 반환
      if (existingKeys.has(key)) {
        return client.storage.from(dbName).getPublicUrl(path).data.publicUrl;
      }

      const { error } = await client.storage.from(dbName).upload(path, file);
      if (error) throw error;

      uploadedPaths.push(path);
      existingKeys.add(key);
      return client.storage.from(dbName).getPublicUrl(path).data.publicUrl;
    };

    try {
      // 1. 새로 추가된 이미지/첨부파일만 업로드 (기존 파일은 이미 스토리지에 있으므로 그대로 둠)
      const inlineUrlByKey: Record<string, string> = {};
      for (const [key, file] of Object.entries(files.inlineImages)) {
        inlineUrlByKey[key] = await uploadFile(INLINE, key, file);
      }
      for (const [key, file] of Object.entries(files.attachments)) {
        await uploadFile(ATTACHMENTS, key, file);
      }

      // 2. 새로 추가된 inline 이미지의 src만 publicUrl로 치환
      // 기존에 남아있는 inline 이미지는 그대로 유지
      const content = replaceInlineImageUrls(formData.content, inlineUrlByKey);

      // 썸네일도 본문에 반영된 실제 url 기준으로 업데이트
      const thumbnail = formData.thumbnail
        ? (findInlineImageSrc(content, formData.thumbnail) ??
          formData.thumbnail)
        : formData.thumbnail;

      // 3. 게시글 업데이트
      // 기존 파일 삭제보다 먼저 수행해, 업데이트 실패 시 기존 파일이 살아있도록 함
      const updateRow = {
        title: formData.title,
        menu_id: formData.menu_id,
        content,
        thumbnail,
        hidden: formData.hidden,
        tags: formData.tags,
      };

      let postUpdateError;
      if (temp) {
        ({ error: postUpdateError } = await client
          .from(TEMP_POST)
          .update(updateRow)
          .eq("id", postId));
      } else {
        ({ error: postUpdateError } = await client
          .from(POST)
          .update({ ...updateRow, excerpt: generateExcerpt(content) })
          .eq("id", postId));
      }
      if (postUpdateError) throw new PostgrestError(postUpdateError);

      // 4. 업데이트 성공 후, 더 이상 쓰이지 않는 기존 파일 정리
      //  - inline 이미지: 본문에서 삭제된(더 이상 참조되지 않는) 이미지
      //  - 첨부파일: 사용자가 명시적으로 삭제한 파일(removedAttachmentKeys)
      // 게시글은 이미 정상적으로 업데이트됐으므로, 실패 시 기존, 신규 파일 모두 유지
      try {
        const keepInlineKeys = extractInlineImageKeys(content);
        const stalePaths = [
          ...(await listStalePaths(
            client,
            dbName,
            `${postId}/${INLINE}`,
            keepInlineKeys
          )),
          ...files.removedAttachmentKeys.map(
            (key) => `${postId}/${ATTACHMENTS}/${key}`
          ),
        ];

        if (stalePaths.length) {
          const { error: removeError } = await client.storage
            .from(dbName)
            .remove(stalePaths);
          if (removeError) throw removeError;
        }
      } catch (cleanupError) {
        console.error("불필요한 파일 정리 실패:", cleanupError);
      }

      const attachments = await listStorageFiles(
        client,
        dbName,
        `${postId}/${ATTACHMENTS}`
      );

      return { id: postId, content, thumbnail, attachments };
    } catch (error) {
      // 업데이트 실패 시, 새로 업로드한 파일은 게시글 모두 삭제 (기존 파일은 그대로 유지)
      if (uploadedPaths.length) {
        await client.storage.from(dbName).remove(uploadedPaths);
      }
      throw error;
    }
  };

  const deletePost = async (id: number, temp: boolean = false) => {
    const dbName = temp ? TEMP_POST : POST;

    const { error: postError } = await client
      .from(dbName)
      .delete()
      .eq("id", id);
    if (postError) throw new PostgrestError(postError);

    try {
      await removePostFiles(client, dbName, id);
    } catch (cleanupError) {
      console.error(`게시글(${id}) 파일 정리 실패:`, cleanupError);
    }

    return id;
  };

  const getFiles = async (
    postId: number,
    temp: boolean = false
  ): Promise<PostStorageFiles> => {
    const bucket = temp ? TEMP_POST : POST;

    const [inlineImages, attachments] = await Promise.all([
      listStorageFiles(client, bucket, `${postId}/${INLINE}`),
      listStorageFiles(client, bucket, `${postId}/${ATTACHMENTS}`),
    ]);

    return { inlineImages, attachments };
  };

  /*
   임시저장 글을 정식 게시글로 등록
   1. temp_posts 스토리지에 남아 있는 파일을 내려받아 신규 posts 업로드 대상에 합침
   2. posts 테이블/버킷에 새로 저장
   3. 성공 후 임시저장 글(및 파일) 삭제
  */
  const publishFromTemp = async (
    tempId: number,
    formData: PostInsertType,
    files: PostUpdateFile
  ): Promise<PostSaveResult> => {
    const existing = await getFiles(tempId, true);
    const keepInlineKeys = extractInlineImageKeys(formData.content);
    const removedAttachmentKeys = new Set(files.removedAttachmentKeys);

    const downloadAsFile = async (
      storageFile: PostStorageFile
    ): Promise<File> => {
      const { data, error } = await client.storage
        .from(TEMP_POST)
        .download(storageFile.path);
      if (error) throw error;

      return new File([data], storageFile.key, {
        type: data.type || undefined,
      });
    };

    const inlineImages: Record<string, File> = { ...files.inlineImages };
    for (const storageFile of existing.inlineImages) {
      if (
        !keepInlineKeys.has(storageFile.key) ||
        inlineImages[storageFile.key]
      ) {
        continue;
      }
      inlineImages[storageFile.key] = await downloadAsFile(storageFile);
    }

    const attachments: Record<string, File> = { ...files.attachments };
    for (const storageFile of existing.attachments) {
      if (
        removedAttachmentKeys.has(storageFile.key) ||
        attachments[storageFile.key]
      ) {
        continue;
      }
      attachments[storageFile.key] = await downloadAsFile(storageFile);
    }

    const saved = await create(formData, { inlineImages, attachments }, false);

    try {
      await deletePost(tempId, true);
    } catch (cleanupError) {
      // 등록은 이미 성공했으므로, 임시글 삭제 실패는 로그만 남기고 결과는 반환
      console.error(
        `임시저장 글(${tempId}) 삭제 실패 (게시글 ${saved.id}는 등록됨):`,
        cleanupError
      );
    }

    return saved;
  };

  /*
   체크한 게시글을 일괄 삭제
   1. RPC(posts_bulk_delete)로 게시글 본문 삭제
   2. 삭제에 성공한 게시글에 대해서만 스토리지 파일을 삭제
  */
  const bulkDelete = async (postIds: number[]): Promise<PostBulkFailure[]> => {
    const { data, error } = await client.rpc("posts_bulk_delete", {
      post_ids: postIds,
    });
    if (error) throw new PostgrestError(error);

    const failures = data ?? [];
    const failedIds = new Set(failures.map((failure) => failure.post_id));
    const succeededIds = postIds.filter((id) => !failedIds.has(id));

    await Promise.all(
      succeededIds.map(async (id) => {
        try {
          await removePostFiles(client, POST, id);
        } catch (cleanupError) {
          console.error(`게시글(${id}) 파일 정리 실패:`, cleanupError);
        }
      })
    );

    return failures;
  };

  const getPostNeighbors = async (postId: number) => {
    const { data, error } = await client.rpc("get_post_neighbors", {
      p_post_id: postId,
    });

    if (error) throw new PostgrestError(error);

    return data;
  };

  return {
    getList: async ({
      page,
      perPage,
      slugs: slug,
      query: q,
      visibility = "all",
    }: GetPostListParams) => {
      const from = (page - 1) * perPage;
      const to = from + perPage - 1;

      const keyword = q?.trim();

      // 검색어가 있으면 RPC, 없으면 기본 테이블에서 조회
      let query = keyword
        ? client
            .rpc(
              "search_posts_or_title_phrase_or_tags_any",
              { q: keyword },
              { count: "exact" }
            )
            .select(LIST_SELECT_COLUMNS)
        : client.from(POST).select(LIST_SELECT_COLUMNS, { count: "exact" });

      if (slug?.length) query = query.in("menus.slug", slug);
      if (visibility === "public") query = query.eq("hidden", false);
      else if (visibility === "private") query = query.eq("hidden", true);

      // 필터, 페이지네이션 적용된 목록 (count는 필터 반영된 전체 개수)
      const { data, count, error } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw new PostgrestError(error);

      const rows = (data ?? []) as unknown as PostRowWithMenuSlug[];

      return {
        data: rows.map(({ menus, ...post }) => ({
          ...post,
          menu_slug: menus.slug,
        })),
        count: count ?? 0,
      };
    },
    getTempList: async () => {
      const { data, count, error } = await client
        .from(TEMP_POST)
        .select("id, title, created_at", { count: "exact" })
        .order("created_at", { ascending: false });
      if (error) throw new PostgrestError(error);

      return {
        data: data ?? [],
        count: count ?? 0,
      };
    },
    create,
    getById,
    getFiles,
    update,
    delete: deletePost,
    publishFromTemp,
    bulkDelete,
    getPostNeighbors,
  };
};
