import type { Page } from '@playwright/test'

export interface ViewTransitionEvent {
  type: 'pagereveal'
  hasTransition: boolean
}

export interface ViewTransitionAnimation {
  pseudo: string | null
  duration: number | null
}

// Cross-document view transitions run across a navigation, so the observer has to be injected
// into every document before its scripts run. `pagereveal` fires in the incoming document with
// a `viewTransition` when the browser started one; once `viewTransition.ready` resolves the
// `::view-transition-*` pseudo-element animations exist and their durations are readable.
export const recordViewTransitions = async (page: Page) => {
  await page.addInitScript(() => {
    const events: ViewTransitionEvent[] = []
    Object.assign(window, { __viewTransitionEvents: events })

    window.addEventListener('pagereveal', (event) => {
      const { viewTransition } = event as Event & { viewTransition?: ViewTransition }
      events.push({ type: 'pagereveal', hasTransition: Boolean(viewTransition) })
      if (!viewTransition) return

      void viewTransition.ready.then(() => {
        const animations = document.getAnimations().map((animation) => ({
          pseudo: animation.effect ? animation.effect.pseudoElement : null,
          duration: animation.effect ? animation.effect.getTiming().duration : null,
        }))
        Object.assign(window, { __viewTransitionAnimations: animations })
      })
    })
  })
}

export const readViewTransitionEvents = (page: Page): Promise<ViewTransitionEvent[]> =>
  page.evaluate(
    () =>
      (window as { __viewTransitionEvents?: ViewTransitionEvent[] }).__viewTransitionEvents ?? []
  )

// Only the view transition pseudo-elements matter; page CSS transitions (hover, TOC chevron)
// must not be mistaken for the navigation animation.
export const readViewTransitionAnimations = (page: Page): Promise<ViewTransitionAnimation[]> =>
  page.evaluate(() =>
    (
      (window as { __viewTransitionAnimations?: ViewTransitionAnimation[] })
        .__viewTransitionAnimations ?? []
    ).filter((animation) => animation.pseudo?.startsWith('::view-transition'))
  )
