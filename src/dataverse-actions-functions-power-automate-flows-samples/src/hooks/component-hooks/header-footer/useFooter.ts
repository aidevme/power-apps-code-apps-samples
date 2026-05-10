/** Return value of {@link useFooter}. */
export interface IUseFooterResult {
  /** The current calendar year, used in the copyright notice. */
  year: number
}

/**
 * Provides computed values for the {@link Footer} component.
 *
 * @returns The current year for the copyright notice.
 * @example
 * ```ts
 * const { year } = useFooter()
 * ```
 */
export function useFooter(): IUseFooterResult {
  return {
    year: new Date().getFullYear(),
  }
}
