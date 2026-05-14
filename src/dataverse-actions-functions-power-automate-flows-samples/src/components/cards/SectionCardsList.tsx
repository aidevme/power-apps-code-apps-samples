// AI-CONTEXT: Renders the full home-page section-card grid (Data Access, Dataverse APIs, Integrations, Miscellaneous, Reference).
// AI-FILE-RELATIONS:
//   - consumer:  src/components/apps/MainApp.tsx          (sole consumer — rendered inside the root div)
//   - styles:    src/styles/mainapp.styles.ts              (groupHeader, groupIcon, groupHeading, grid)
//   - card:      src/components/cards/SectionCard.tsx     (leaf card component)
//   - routes:    src/tools/routes.ts                      (route constants kept in sync with navigate() calls)
// AI-PATTERN: Add new section cards here only; do not split into per-section sub-components unless sections grow significantly.

import { Text } from '@fluentui/react-components'
import { useNavigate } from 'react-router-dom'
import { useMainAppStyles } from '../../styles/mainapp.styles'
import { SectionCard } from './SectionCard'
import {
  DatabaseRegular,
  CodeRegular,
  FlashRegular,
  WrenchRegular,
  PlugConnectedRegular,
  ArrowRepeatAllRegular,
  BookOpenRegular,
  TableRegular,
  CloudRegular,
  ShareRegular,
  BookRegular,
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

/** Props for {@link SectionCardsList}. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ISectionCardsListProps {
  // reserved for future filtering or search props
}

/**
 * Grouped section-card grid for the home page.
 *
 * @remarks
 * Renders five sections in order: Data Access, Dataverse APIs, Integrations,
 * Miscellaneous, and Reference. Each {@link SectionCard} navigates to its
 * corresponding route via React Router on click.
 *
 * Add new cards directly in this component; do not split sections into
 * separate sub-components unless a section grows substantially.
 *
 * @example
 * ```tsx
 * <SectionCardsList />
 * ```
 */
export function SectionCardsList() {
  const styles = useMainAppStyles()
  const navigate = useNavigate()

  return (
    <>
      {/* ── Data Access ───────────────────────────────────────────────── */}
      <section>
        <div className={styles.groupHeader}>
          <div className={styles.groupIcon}><TableRegular /></div>
          <Text as="h3" weight="semibold" size={500} className={styles.groupHeading}>Data Access</Text>
        </div>
        <div className={styles.grid}>
          <SectionCard
            title="CRUD Operations"
            description="Perform create, read, update, and delete operations against Dataverse table records via the OData v4 REST API. Demonstrates typed entity models, query options ($select, $filter, $expand), optimistic concurrency, and batch requests using the PAC CLI-generated service layer."
            category="Dataverse Table"
            sectionCardCategoryName='data-access'
            sectionCardCategoryDisplayName='Data Access'
            icon={<DatabaseRegular />}
            onMore={() => navigate('/crud')}
          />
        </div>
      </section>

      {/* ── Dataverse APIs ────────────────────────────────────────────── */}
      <section>
        <div className={styles.groupHeader}>
          <div className={styles.groupIcon}><CloudRegular /></div>
          <Text as="h3" weight="semibold" size={500} className={styles.groupHeading}>Dataverse APIs</Text>
        </div>
        <div className={styles.grid}>
          <SectionCard
            title="Dataverse Functions"
            description="Invoke unbound Custom API Functions registered in Dataverse using HTTP GET with OData inline parameters. Functions are read-only, side-effect-free operations that return strongly-typed response payloads, demonstrated here with the WhoAmI built-in function via the PAC-generated WhoAmIService."
            category="Function"
            sectionCardCategoryName='dataverse-apis'
            sectionCardCategoryDisplayName='Dataverse APIs'
            icon={<CodeRegular />}
            onMore={() => navigate('/functions')}
          />
          <SectionCard
            title="Dataverse Actions"
            description="Execute unbound Custom API Actions registered in Dataverse using HTTP POST with a structured JSON request body. Actions encapsulate business logic with side effects and return typed response objects, demonstrated here with the AddToQueue action via the PAC-generated AddToQueueService."
            category="Action"
            sectionCardCategoryName='dataverse-apis'
            sectionCardCategoryDisplayName='Dataverse APIs'
            icon={<FlashRegular />}
            onMore={() => navigate('/actions')}
          />
          <SectionCard
            title="Dataverse Custom Actions"
            description="Define and invoke your own Custom API Actions registered in Dataverse. Learn how to register message endpoints, attach request/response parameters, and call them from a Code App using PAC CLI-generated typed services."
            category="Custom Action"
            sectionCardCategoryName='dataverse-apis'
            sectionCardCategoryDisplayName='Dataverse APIs'
            icon={<WrenchRegular />}
            onMore={() => navigate('/custom-actions')}
          />
          <SectionCard
            title="Dataverse Custom APIs"
            description="Explore the full Custom API lifecycle: registering both Functions and Actions as first-class Dataverse API endpoints, configuring privilege and binding options, generating typed service stubs with PAC CLI, and calling them securely from a Power Apps Code App."
            category="Custom API"
            sectionCardCategoryName='dataverse-apis'
            sectionCardCategoryDisplayName='Dataverse APIs'
            icon={<PlugConnectedRegular />}
            onMore={() => navigate('/custom-apis')}
          />
        </div>
      </section>

      {/* ── Integrations ──────────────────────────────────────────────── */}
      <section>
        <div className={styles.groupHeader}>
          <div className={styles.groupIcon}><ShareRegular /></div>
          <Text as="h3" weight="semibold" size={500} className={styles.groupHeading}>Integrations</Text>
        </div>
        <div className={styles.grid}>
          <SectionCard
            title="Power Automate Flows"
            description="Trigger instant Power Automate cloud flows via their HTTP Request connector using a POST to the flow's trigger URL. Demonstrates passing structured input payloads, reading typed response bodies, and handling async flow execution patterns from within a Power Apps Code App."
            category="Instant Flow"
            sectionCardCategoryName='integrations'
            sectionCardCategoryDisplayName='Integrations'
            icon={<ArrowRepeatAllRegular />}
            onMore={() => navigate('/flows')}
          />
          <SectionCard
            title="Azure SQL"
            description="Read and write data to Azure SQL Database from a Power Apps Code App via Power Automate flows or a custom connector. Demonstrates parameterised queries, typed row models, and handling database responses in a React component using PAC CLI-generated service stubs."
            category="Azure SQL"
            sectionCardCategoryName='integrations'
            sectionCardCategoryDisplayName='Integrations'
            icon={<ServerRegular />}
            onMore={() => navigate('/azure-sql')}
          />
          <SectionCard
            title="Azure Blob Storage"
            description="Read and write files in Azure Blob Storage from a Power Apps Code App. Demonstrates uploading, downloading, listing, and deleting blobs via Power Automate flows or a custom connector, with typed request and response payloads surfaced in a React UI."
            category="Azure Storage"
            sectionCardCategoryName='integrations'
            sectionCardCategoryDisplayName='Integrations'
            icon={<CloudRegular />}
            onMore={() => navigate('/azure-blob-storage')}
          />
          <SectionCard
            title="Azure Functions"
            description="Invoke Azure Functions HTTP triggers from a Power Apps Code App. Demonstrates calling serverless endpoints with typed request and response payloads, handling authentication, and integrating custom compute logic into a React UI using PAC CLI-generated service stubs."
            category="Azure Functions"
            sectionCardCategoryName='integrations'
            sectionCardCategoryDisplayName='Integrations'
            icon={<FlashSparkleRegular />}
            onMore={() => navigate('/azure-functions')}
          />
          <SectionCard
            title="SharePoint"
            description="Interact with SharePoint lists and document libraries from a Power Apps Code App using the SharePoint connector. Covers reading list items with OData filters, creating and updating records, managing attachments, and surfacing SharePoint data in a typed React UI."
            category="SharePoint"
            sectionCardCategoryName='integrations'
            sectionCardCategoryDisplayName='Integrations'
            icon={<GridRegular />}
            onMore={() => navigate('/sharepoint')}
          />
        </div>
      </section>

      {/* ── Miscellaneous ──────────────────────────────────────────────── */}
      <section>
        <div className={styles.groupHeader}>
          <div className={styles.groupIcon}><KeyMultipleRegular /></div>
          <Text as="h3" weight="semibold" size={500} className={styles.groupHeading}>Miscellaneous</Text>
        </div>
        <div className={styles.grid}>
          <SectionCard
            title="Environment Variables"
            description="Read Power Platform environment variables from a Power Apps Code App. Demonstrates how to retrieve string, number, boolean, and JSON schema values stored as environment variables in a solution, and consume them at runtime to keep app configuration portable across environments."
            category="Environment Variables"
            sectionCardCategoryName='miscellaneous'
            sectionCardCategoryDisplayName='Miscellaneous'
            icon={<KeyMultipleRegular />}
            onMore={() => navigate('/env-variables')}
          />
          <SectionCard
            title="Microsoft Graph API"
            description="Call Microsoft Graph API endpoints from a Power Apps Code App. Demonstrates authenticating with the current user's identity, querying user profiles, group memberships, and other Microsoft 365 resources using the Graph REST API from within a React component."
            category="Microsoft Graph"
            sectionCardCategoryName='miscellaneous'
            sectionCardCategoryDisplayName='Miscellaneous'
            icon={<BranchRegular />}
            onMore={() => navigate('/graph')}
          />
          <SectionCard
            title="Azure Application Insights"
            description="Integrate Azure Application Insights telemetry into a Power Apps Code App. Demonstrates initialising the SDK, wiring the platform logger to forward session load and network request metrics, configuring Content Security Policy, and querying custom events in the Azure portal."
            category="Azure Monitor"
            sectionCardCategoryName='miscellaneous'
            sectionCardCategoryDisplayName='Miscellaneous'
            icon={<DataTrendingRegular />}
            onMore={() => navigate('/app-insights')}
          />
          <SectionCard
            title="Configuration Settings"
            description="Read app-level configuration setting records from the Dataverse aidevme_codeappssamplesconfigurationsetting table. Demonstrates listing key/value pairs stored as Dataverse table rows and surfacing them in a typed React UI using the PAC CLI-generated service layer."
            category="Dataverse Table"
            sectionCardCategoryName='miscellaneous'
            sectionCardCategoryDisplayName='Miscellaneous'
            icon={<SettingsRegular />}
            onMore={() => navigate('/configuration-settings')}
          />
          <SectionCard
            title="Content Security Policy Management"
            description="Manage Power Apps Code App Content Security Policy (CSP) headers to control which external resources the browser is permitted to load. Demonstrates reading and updating CSP directives stored in Dataverse, and how misconfigured policies surface as blocked network requests in the browser console."
            category="Security"
            sectionCardCategoryName='miscellaneous'
            sectionCardCategoryDisplayName='Miscellaneous'
            icon={<ShieldRegular />}
            onMore={() => navigate('/csp-management')}
          />
          <SectionCard
            title="Metadata Browser"
            description="Explore Dataverse entity and attribute metadata retrieved via the PAC CLI-generated service layer. Browse table definitions, column types, required-field flags, relationships, keys, and solution membership for any registered entity. View detailed entity information and visualise table relationships as an entity-relationship diagram — all surfaced in a typed React UI without direct OData calls."
            category="Dataverse Metadata"
            sectionCardCategoryName='miscellaneous'
            sectionCardCategoryDisplayName='Miscellaneous'
            icon={<LayerRegular />}
            onMore={() => navigate('/metadata')}
          />
        </div>
      </section>

      {/* ── Reference ─────────────────────────────────────────────────── */}
      <section>
        <div className={styles.groupHeader}>
          <div className={styles.groupIcon}><BookRegular /></div>
          <Text as="h3" weight="semibold" size={500} className={styles.groupHeading}>Reference</Text>
        </div>
        <div className={styles.grid}>
          <SectionCard
            title="Documentation"
            description="Reference guides, API contracts, and annotated code walkthroughs for every pattern covered in this sample app. Covers Dataverse OData conventions, Custom API registration, PAC CLI commands, Power Automate HTTP trigger setup, and deployment steps."
            category="Reference"
            sectionCardCategoryName='reference'
            sectionCardCategoryDisplayName='Reference'
            icon={<BookOpenRegular />}
            onMore={() => navigate('/docs')}
          />
        </div>
      </section>
    </>
  )
}