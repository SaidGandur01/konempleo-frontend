<template>
  <article />
  <p v-if="false && message && message !== ''">{{ message }}</p>
</template>

<script lang="ts" setup>
interface ISpinnerProps {
  message: string;
}
withDefaults(defineProps<ISpinnerProps>(), {
  message: "Loading",
});
</script>

<style lang="scss" scoped>
* {
  --loader-width: 70px;
  --loader-height: 70px;
  --loader-color-primary: var(--color-brand-primary-400);
  --loader-color-secondary: var(--color-brand-neutral-400);
  --line-width: 3px;
  --animation-duration: 2s;
  --loader-initial-scale: 0.1;
}
.loader,
.loader:before,
.loader:after {
  box-sizing: border-box;
  flex-grow: 0;
  flex-shrink: 0;
}

@keyframes momentum {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}

article {
  --primary-circle-offset: calc(
    ((var(--loader-width, 100px) * 0.2) / 2) - var(--line-width, 4px)
  );
  --secondary-circle-offset: calc(
    ((var(--loader-width, 100px) * 0.4) / 2) - var(--line-width, 4px)
  ); /*- (var(--line-width,4px) * 2)*/
  position: relative;
  width: var(--loader-width, 100px);
  height: var(--loader-height, 100px);
  transform-origin: center center;
  margin-inline: auto;
  border-radius: 50%;
  border: var(--line-width, 4px) solid rgba(0, 0, 0, 0);
  border-top-color: var(--loader-color-primary, grey);
  animation: momentum var(--animation-duration, 1s) linear infinite;
}

article:before {
  content: "";
  position: absolute;
  transform-origin: center center;
  top: var(--primary-circle-offset, 10px);
  left: var(--primary-circle-offset, 10px);
  width: calc(var(--loader-width, 100px) * 0.8);
  height: calc(var(--loader-height, 100px) * 0.8);
  border-radius: 50%;
  border: var(--line-width, 4px) solid rgba(0, 0, 0, 0);
  border-top-color: var(--loader-color-primary, grey);
  opacity: 0.7;
  filter: hue-rotate(3eg);
  animation: momentum calc(var(--animation-duration, 1s) * 2) linear infinite;
}

article:after {
  content: "";
  position: absolute;
  top: var(--secondary-circle-offset, 20px);
  left: var(--secondary-circle-offset, 20px);
  width: calc(var(--loader-width, 100px) * 0.6);
  height: calc(var(--loader-height, 100px) * 0.6);
  border-radius: 50%;
  transform-origin: center center;
  border: var(--line-width, 4px) solid rgba(0, 0, 0, 0);
  border-top-color: var(--loader-color-primary, grey);
  opacity: 0.3;
  filter: hue-rotate(6eg);
  animation: momentum var(--animation-duration, 1s) linear infinite;
}

p {
  width: fit-content;
  margin-inline: auto;
  margin-block-start: 1em;
  font-size: var(--static-size-xl);
  color: var(--color-brand-primary-300);
}
</style>
