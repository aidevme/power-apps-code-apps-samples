// AI-CONTEXT: State management, filter logic, and card configuration data for the home-page SectionCardsList component.
// AI-FILE-RELATIONS:
//   - consumer: src/components/cards/SectionCardsList.tsx  (sole consumer — renders the hook's data and callbacks)
//   - routes:   src/tools/routes.ts                        (route paths in SECTION_CARDS must match registered routes)
// AI-CONSTRAINT: Do not use JSX syntax here — store icon component references as ComponentType and render in the consumer.
// AI-PATTERN: Add new cards to SECTION_CARDS; add new categories to SECTION_CATEGORIES and update dotStyleMap/iconWrapperMap in the consumer.

import { useState } from 'react'
import type { ComponentType } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DatabaseRegular,
  CodeRegular,
  FlashRegular,
  WrenchRegular,
  PlugConnectedRegular,
  ArrowRepeatAllRegular,
  BookOpenRegular,
  CloudRegular,
  ServerRegular,
  GridRegular,
  KeyMultipleRegular,
  FlashSparkleRegular,
  BranchRegular,
  DataTrendingRegular,
  SettingsRegular,
  ShieldRegular,
  LayerRegular,
} from '@fluentui/react-icons'

/**
 * All five home-page section categories in display order.
 *
 * @remarks
 * Drives both the filter bar (all entries) and the section grid (filtered entries).
 * The `id` field is the stable {@link CategoryId} literal used for keying and filtering.
 */
export const SECTION_CATEGORIES = [
  { id: 'data-access',    name: 'Data Access'    },
  { id: 'dataverse-apis', name: 'Dataverse APIs' },
  { id: 'integrations',   name: 'Integrations'   },
  { id: 'miscellaneous',  name: 'Miscellaneous'  },
  { id: 'reference',      name: 'Reference'      },
] as const

/** Literal union of all valid section category identifiers. */
export type CategoryId = typeof SECTION_CATEGORIES[number]['id']

/**
 * Configuration for a single navigable sample card.
 *
 * @remarks
 * `iconComponent` holds a Fluent UI icon component reference (not a rendered element) so this
 * file remains JSX-free. The consumer renders it with:
 * ```tsx
 * const CardIcon = card.iconComponent
 * <SectionCard icon={<CardIcon />} />
 * ```
 */
export interface ICardConfig {
  /** Card title displayed in the header. */
  title: string
  /** Body text describing the sample's purpose. */
  description: string
  /** Type label rendered as a `Caption1` subtitle below the title. */
  category: string
  /**
   * Fluent UI icon component reference. Render in the consumer as:
   * ```tsx
   * const CardIcon = card.iconComponent
   * <SectionCard icon={<CardIcon />} />
   * ```
   */
  // AI-CONSTRAINT: Store as ComponentType (not ReactNode) — JSX is not valid in .ts files.
  iconComponent: ComponentType
  /** React Router route path navigated to when the card's Open button is clicked. */
  route: string
}

// AI-PATTERN: Add new cards to the relevant category array. Count is derived from array length automatically.
/**
 * Full card configuration map, keyed by {@link CategoryId}.
 *
 * @remarks
 * Icons are stored as component references so this file stays JSX-free.
 * The consumer renders each icon as `const CardIcon = card.iconComponent; <SectionCard icon={<CardIcon />} />`.
 */
export const SECTION_CARDS: Record<CategoryId, readonly ICardConfig[]> = {
  'data-access': [
    {
      title: 'CRUD Operations',
      description: 'Perform create, read, update, and delete operations against Dataverse table records via the OData v4 REST API. Demonstrates typed entity models, query options ($select, $filter, $expand), optimistic concurrency, and batch requests using the PAC CLI-generated service layer.',
      category: 'Dataverse Table',
      iconComponent: DatabaseRegular,
      route: '/crud',
    },
  ],
  'dataverse-apis': [
    {
      title: 'Dataverse Functions',
      description: 'Invoke unbound Custom API Functions registered in Dataverse using HTTP GET with OData inline parameters. Functions are read-only, side-effect-free operations that return strongly-typed response payloads, demonstrated here with the WhoAmI built-in function via the PAC-generated WhoAmIService.',
      category: 'Function',
      iconComponent: CodeRegular,
      route: '/functions',
    },
    {
      title: 'Dataverse Actions',
      description: 'Execute unbound Custom API Actions registered in Dataverse using HTTP POST with a structured JSON request body. Actions encapsulate business logic with side effects and return typed response objects, demonstrated here with the AddToQueue action via the PAC-generated AddToQueueService.',
      category: 'Action',
      iconComponent: FlashRegular,
      route: '/actions',
    },
    {
      title: 'Dataverse Custom Actions',
      description: 'Define and invoke your own Custom API Actions registered in Dataverse. Learn how to register message endpoints, attach request/response parameters, and call them from a Code App using PAC CLI-generated typed services.',
      category: 'Custom Action',
      iconComponent: WrenchRegular,
      route: '/custom-actions',
    },
    {
      title: 'Dataverse Custom APIs',
      description: 'Explore the full Custom API lifecycle: registering both Functions and Actions as first-class Dataverse API endpoints, configuring privilege and binding options, generating typed service stubs with PAC CLI, and calling them securely from a Power Apps Code App.',
      category: 'Custom API',
      iconComponent: PlugConnectedRegular,
      route: '/custom-apis',
    },
  ],
  'integrations': [
    {
      title: 'Power Automate Flows',
      description: "Trigger instant Power Automate cloud flows via their HTTP Request connector using a POST to the flow's trigger URL. Demonstrates passing structured input payloads, reading typed response bodies, and handling async flow execution patterns from within a Power Apps Code App.",
      category: 'Instant Flow',
      iconComponent: ArrowRepeatAllRegular,
      route: '/flows',
    },
    {
      title: 'Azure SQL',
      description: 'Read and write data to Azure SQL Database from a Power Apps Code App via Power Automate flows or a custom connector. Demonstrates parameterised queries, typed row models, and handling database responses in a React component using PAC CLI-generated service stubs.',
      category: 'Azure SQL',
      iconComponent: ServerRegular,
      route: '/azure-sql',
    },
    {
      title: 'Azure Blob Storage',
      description: 'Read and write files in Azure Blob Storage from a Power Apps Code App. Demonstrates uploading, downloading, listing, and deleting blobs via Power Automate flows or a custom connector, with typed request and response payloads surfaced in a React UI.',
      category: 'Azure Storage',
      iconComponent: CloudRegular,
      route: '/azure-blob-storage',
    },
    {
      title: 'Azure Functions',
      description: 'Invoke Azure Functions HTTP triggers from a Power Apps Code App. Demonstrates calling serverless endpoints with typed request and response payloads, handling authentication, and integrating custom compute logic into a React UI using PAC CLI-generated service stubs.',
      category: 'Azure Functions',
      iconComponent: FlashSparkleRegular,
      route: '/azure-functions',
    },
    {
      title: 'SharePoint',
      description: 'Interact with SharePoint lists and document libraries from a Power Apps Code App using the SharePoint connector. Covers reading list items with OData filters, creating and updating records, managing attachments, and surfacing SharePoint data in a typed React UI.',
      category: 'SharePoint',
      iconComponent: GridRegular,
      route: '/sharepoint',
    },
  ],
  'miscellaneous': [
    {
      title: 'Environment Variables',
      description: 'Read Power Platform environment variables from a Power Apps Code App. Demonstrates how to retrieve string, number, boolean, and JSON schema values stored as environment variables in a solution, and consume them at runtime to keep app configuration portable across environments.',
      category: 'Environment Variables',
      iconComponent: KeyMultipleRegular,
      route: '/env-variables',
    },
    {
      title: 'Microsoft Graph API',
      description: "Call Microsoft Graph API endpoints from a Power Apps Code App. Demonstrates authenticating with the current user's identity, querying user profiles, group memberships, and other Microsoft 365 resources using the Graph REST API from within a React component.",
      category: 'Microsoft Graph',
      iconComponent: BranchRegular,
      route: '/graph',
    },
    {
      title: 'Azure Application Insights',
      description: 'Integrate Azure Application Insights telemetry into a Power Apps Code App. Demonstrates initialising the SDK, wiring the platform logger to forward session load and network request metrics, configuring Content Security Policy, and querying custom events in the Azure portal.',
      category: 'Azure Monitor',
      iconComponent: DataTrendingRegular,
      route: '/app-insights',
    },
    {
      title: 'Configuration Settings',
      description: 'Read app-level configuration setting records from the Dataverse aidevme_codeappssamplesconfigurationsetting table. Demonstrates listing key/value pairs stored as Dataverse table rows and surfacing them in a typed React UI using the PAC CLI-generated service layer.',
      category: 'Dataverse Table',
      iconComponent: SettingsRegular,
      route: '/configuration-settings',
    },
    {
      title: 'Content Security Policy Management',
      description: 'Manage Power Apps Code App Content Security Policy (CSP) headers to control which external resources the browser is permitted to load. Demonstrates reading and updating CSP directives stored in Dataverse, and how misconfigured policies surface as blocked network requests in the browser console.',
      category: 'Security',
      iconComponent: ShieldRegular,
      route: '/csp-management',
    },
    {
      title: 'Metadata Browser',
      description: 'Explore Dataverse entity and attribute metadata retrieved via the PAC CLI-generated service layer. Browse table definitions, column types, required-field flags, relationships, keys, and solution membership for any registered entity. View detailed entity information and visualise table relationships as an entity-relationship diagram — all surfaced in a typed React UI without direct OData calls.',
      category: 'Dataverse Metadata',
      iconComponent: LayerRegular,
      route: '/metadata',
    },
  ],
  'reference': [
    {
      title: 'Documentation',
      description: 'Reference guides, API contracts, and annotated code walkthroughs for every pattern covered in this sample app. Covers Dataverse OData conventions, Custom API registration, PAC CLI commands, Power Automate HTTP trigger setup, and deployment steps.',
      category: 'Reference',
      iconComponent: BookOpenRegular,
      route: '/docs',
    },
  ],
}

// AI-CONTEXT: Module-level constant — derived from SECTION_CARDS which never changes at runtime.
const TOTAL_SAMPLES = SECTION_CATEGORIES.reduce((sum, cat) => sum + SECTION_CARDS[cat.id].length, 0)

/** Return type of {@link useSectionCards}. */
export interface IUseSectionCardsResult {
  /** All five categories in display order — drives the filter bar. */
  allCategories: typeof SECTION_CATEGORIES
  /** Categories currently visible given the active filter; equals `allCategories` when no filter is set. */
  visibleCategories: ReadonlyArray<typeof SECTION_CATEGORIES[number]>
  /** Full card configuration map — index by {@link CategoryId}. */
  cards: typeof SECTION_CARDS
  /** Currently active category filter, or `null` when showing all. */
  activeCategory: CategoryId | null
  /**
   * Sets the active category filter.
   *
   * @param id - Category to filter by, or `null` to show all categories.
   */
  setActiveCategory: (id: CategoryId | null) => void
  /** Total number of samples across all categories. */
  totalSamples: number
  /** Number of samples currently visible given the active filter. */
  totalVisible: number
  /**
   * Navigates to the given React Router route path.
   *
   * @param route - A route path from {@link SECTION_CARDS}, e.g. `'/crud'`.
   */
  navigateTo: (route: string) => void
}

/**
 * Manages filter state, visible categories, sample counts, and navigation for the home-page section-card grid.
 *
 * @returns Data and callbacks for {@link SectionCardsList} — see {@link IUseSectionCardsResult}.
 *
 * @example
 * ```ts
 * const { visibleCategories, cards, activeCategory, setActiveCategory, navigateTo } = useSectionCards()
 * ```
 */
export function useSectionCards(): IUseSectionCardsResult {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null)

  // AI-CONTEXT: Pre-filter categories so the component receives ready-to-render data with no filtering logic.
  const visibleCategories: ReadonlyArray<typeof SECTION_CATEGORIES[number]> = activeCategory
    ? SECTION_CATEGORIES.filter(c => c.id === activeCategory)
    : SECTION_CATEGORIES

  const totalVisible = activeCategory ? SECTION_CARDS[activeCategory].length : TOTAL_SAMPLES

  function navigateTo(route: string): void {
    navigate(route)
  }

  return {
    allCategories: SECTION_CATEGORIES,
    visibleCategories,
    cards: SECTION_CARDS,
    activeCategory,
    setActiveCategory,
    totalSamples: TOTAL_SAMPLES,
    totalVisible,
    navigateTo,
  }
}
