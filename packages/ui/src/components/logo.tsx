import { type ComponentProps } from "solid-js"

export const Mark = (props: { class?: string }) => {
  return (
    <svg
      data-component="logo-mark"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        data-slot="logo-flow-shadow"
        d="M4 19V5L20 19V5"
        stroke="var(--icon-weak-base)"
        stroke-width="3.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        data-slot="logo-flow-primary"
        d="M5 19V7L19 19V5"
        stroke="var(--icon-strong-base)"
        stroke-width="2.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        data-slot="logo-flow-accent"
        d="M7 5L19 17"
        stroke="var(--accent-base, #00f0ff)"
        stroke-width="1.8"
        stroke-linecap="round"
      />
    </svg>
  )
}

export const Splash = (props: Pick<ComponentProps<"svg">, "ref" | "class">) => {
  return (
    <svg
      ref={props.ref}
      data-component="logo-splash"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="10" y="10" width="76" height="76" rx="18" fill="var(--background-base, #030303)" />
      <rect
        x="10"
        y="10"
        width="76"
        height="76"
        rx="18"
        stroke="var(--accent-base, #00f0ff)"
        stroke-opacity="0.45"
        stroke-width="2"
      />
      <path
        d="M26 72V28L70 72V24"
        stroke="var(--icon-strong-base)"
        stroke-width="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M32 24L70 62"
        stroke="var(--accent-base, #00f0ff)"
        stroke-width="5"
        stroke-linecap="round"
      />
    </svg>
  )
}

export const Logo = (props: { class?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 252 42"
      fill="none"
      classList={{ [props.class ?? ""]: !!props.class }}
    >
      <g transform="translate(2 3) scale(1.5)">
        <path
          d="M4 19V5L20 19V5"
          stroke="var(--icon-weak-base)"
          stroke-width="3.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M5 19V7L19 19V5"
          stroke="var(--icon-strong-base)"
          stroke-width="2.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path d="M7 5L19 17" stroke="var(--accent-base, #00f0ff)" stroke-width="1.8" stroke-linecap="round" />
      </g>
      <text
        x="40"
        y="29"
        fill="var(--icon-strong-base)"
        font-family="JetBrains Mono, Fira Code, ui-monospace, SFMono-Regular, Menlo, monospace"
        font-size="24"
        font-weight="700"
        letter-spacing="1.8"
      >
        NEXUSFLOW
      </text>
    </svg>
  )
}
