// database.types.ts
import type { MergeDeep } from "type-fest";
import type { Database as DatabaseGenerated } from "./database.types";
import type { PostNeighbors } from "./supabase";

// JSON 타입을 구체적으로 정의해 기존 Database 타입 확장

export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Functions: {
        get_post_neighbors: {
          Args: {
            p_post_id: number;
          };
          Returns: PostNeighbors | null;
        };
      };
    };
  }
>;
