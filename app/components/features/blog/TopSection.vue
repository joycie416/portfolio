<template>
  <section id="top" class="top-section">
    <NuxtImg src="/images/BackgroundImage02.jpg" class="background-image" />
    <div class="content">
      <h1>
        <code class="code-card">
          <span class="bracket">{</span>
          <span class="field">
            <span class="field-label">author:</span>
            <span class="field-value-container">
              <span class="field-value">"{{ typedMessage.author }}"</span>
            </span>
          </span>
          <span class="field">
            <span class="field-label">description:</span>
            <span class="field-value-container">
              <span class="field-value">"{{ typedMessage.description }}"</span>
            </span>
          </span>
          <span class="bracket">}</span>
        </code>
      </h1>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Message {
  author: string;
  description: string;
}

const DEFAULT_MESSAGES: Message[] = [
  {
    author: "Haein Cho",
    description: "I'm a frontend developer",
  },
  {
    author: "Joyce",
    description: "Notes on what I learn while developing",
  },
  {
    author: "Haein",
    description: "Thanks for visiting!",
  },
];

const TYPING_INTERVAL_MS = 45;
const MESSAGE_HOLD_MS = 1400;

const typedMessage = reactive<Message>({
  author: "",
  description: "",
});

const messageIndex = ref(0);
let animationTimer: ReturnType<typeof setTimeout> | null = null;

const clearAnimationTimer = () => {
  if (!animationTimer) return;
  clearTimeout(animationTimer);
  animationTimer = null;
};

const schedule = (callback: () => void, delay: number) => {
  clearAnimationTimer();
  animationTimer = setTimeout(callback, delay);
};

const typeText = (
  value: string,
  targetKey: keyof Message,
  done: () => void,
  charIndex = 0
) => {
  if (charIndex > value.length) {
    done();
    return;
  }

  typedMessage[targetKey] = value.slice(0, charIndex);
  schedule(
    () => typeText(value, targetKey, done, charIndex + 1),
    TYPING_INTERVAL_MS
  );
};

const runSequence = () => {
  const currentMessage =
    DEFAULT_MESSAGES[messageIndex.value] ?? DEFAULT_MESSAGES[0];
  if (!currentMessage) return;
  typedMessage.author = "";
  typedMessage.description = "";

  typeText(currentMessage.author, "author", () => {
    typeText(currentMessage.description, "description", () => {
      schedule(() => {
        messageIndex.value = (messageIndex.value + 1) % DEFAULT_MESSAGES.length;
        runSequence();
      }, MESSAGE_HOLD_MS);
    });
  });
};

onMounted(() => {
  runSequence();
});

onBeforeUnmount(() => {
  clearAnimationTimer();
});
</script>

<style lang="scss" scoped>
.top-section {
  width: 100%;
  min-height: calc(100vh - var(--header-height));
  position: relative;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
}

.content {
  position: absolute;
  inset: 0;
  background-color: color-mix(in srgb, black 50%, transparent);

  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-inline: 20px;

  color: white;

  h1 {
    font-size: 40px;
    font-weight: 700;
    line-height: 1.2;

    @include md {
      font-size: 48px;
    }
  }

  .code-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px 0px;
    border-radius: 10px;
    font-family:
      ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono",
      "Courier New", monospace;
    font-size: 24px;
    line-height: 1.4;
    white-space: pre-wrap;

    @include md {
      font-size: 32px;
      padding: 16px 20px;
    }

    @include lg {
      font-size: 40px;
    }
  }

  .bracket {
    color: white;
  }

  .field {
    display: flex;
    flex-direction: column;
    row-gap: 2px;
    margin-left: 2ch;

    @include md {
      display: grid;
      grid-template-columns: max-content minmax(0, 1fr);
      column-gap: 14px;
      align-items: start;
      row-gap: 0;
    }
  }

  .field-label {
    color: var(--color-primary-500);
  }

  .field-value {
    display: block;
    min-width: 0;
    color: white;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .field-value-container {
    display: block;
    margin-left: 2ch;
    min-width: 0;

    @include md {
      margin-left: 0;
    }
  }

  p {
    font-size: 20px;
    font-weight: 400;
    line-height: 1.5;
    text-align: center;
    margin-bottom: 20px;
    @include md {
      font-size: 24px;
    }
  }

  h1,
  p {
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }
}
</style>
