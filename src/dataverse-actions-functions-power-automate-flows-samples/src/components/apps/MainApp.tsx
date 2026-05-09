import type { ReactElement } from 'react'
import { Text } from '@fluentui/react-components'
import { useMainAppStyles } from '../../styles/mainapp.styles'
import { SectionCard } from '..'
import { useNavigate } from 'react-router-dom'
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
} from '@fluentui/react-icons'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Props for {@link MainApp}. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IMainAppProps {
  // reserved for future configuration props
}

// ---------------------------------------------------------------------------
// MainApp
// ---------------------------------------------------------------------------

/**
 * Home section-card grid grouped by concept. Each card navigates to its route
 * via React Router. Groups progress from foundational data access through
 * Dataverse APIs, integrations, and reference material.
 *
 * @example
 * ```tsx
 * <MainApp />
 * ```
 */
export function MainApp(): ReactElement {
  const styles = useMainAppStyles()
  const navigate = useNavigate()

  return (
    <div className={styles.root}>

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
            icon={<CodeRegular />}
            onMore={() => navigate('/functions')}
          />
          <SectionCard
            title="Dataverse Actions"
            description="Execute unbound Custom API Actions registered in Dataverse using HTTP POST with a structured JSON request body. Actions encapsulate business logic with side effects and return typed response objects, demonstrated here with the AddToQueue action via the PAC-generated AddToQueueService."
            category="Action"
            icon={<FlashRegular />}
            onMore={() => navigate('/actions')}
          />
          <SectionCard
            title="Dataverse Custom Actions"
            description="Define and invoke your own Custom API Actions registered in Dataverse. Learn how to register message endpoints, attach request/response parameters, and call them from a Code App using PAC CLI-generated typed services."
            category="Custom Action"
            icon={<WrenchRegular />}
            onMore={() => navigate('/custom-actions')}
          />
          <SectionCard
            title="Dataverse Custom APIs"
            description="Explore the full Custom API lifecycle: registering both Functions and Actions as first-class Dataverse API endpoints, configuring privilege and binding options, generating typed service stubs with PAC CLI, and calling them securely from a Power Apps Code App."
            category="Custom API"
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
            icon={<ArrowRepeatAllRegular />}
            onMore={() => navigate('/flows')}
          />
          <SectionCard
            title="Azure SQL"
            description="Read and write data to Azure SQL Database from a Power Apps Code App via Power Automate flows or a custom connector. Demonstrates parameterised queries, typed row models, and handling database responses in a React component using PAC CLI-generated service stubs."
            category="Azure SQL"
            icon={<ServerRegular />}
            onMore={() => navigate('/azure-sql')}
          />
          <SectionCard
            title="Azure Functions"
            description="Invoke Azure Functions HTTP triggers from a Power Apps Code App. Demonstrates calling serverless endpoints with typed request and response payloads, handling authentication, and integrating custom compute logic into a React UI using PAC CLI-generated service stubs."
            category="Azure Functions"
            icon={<FlashSparkleRegular />}
            onMore={() => navigate('/azure-functions')}
          />
          <SectionCard
            title="SharePoint"
            description="Interact with SharePoint lists and document libraries from a Power Apps Code App using the SharePoint connector. Covers reading list items with OData filters, creating and updating records, managing attachments, and surfacing SharePoint data in a typed React UI."
            category="SharePoint"
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
            icon={<KeyMultipleRegular />}
            onMore={() => navigate('/env-variables')}
          />
          <SectionCard
            title="Microsoft Graph API"
            description="Call Microsoft Graph API endpoints from a Power Apps Code App. Demonstrates authenticating with the current user's identity, querying user profiles, group memberships, and other Microsoft 365 resources using the Graph REST API from within a React component."
            category="Microsoft Graph"
            icon={<BranchRegular />}
            onMore={() => navigate('/graph')}
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
            icon={<BookOpenRegular />}
            onMore={() => navigate('/docs')}
          />
        </div>
      </section>

    </div>
  )
}