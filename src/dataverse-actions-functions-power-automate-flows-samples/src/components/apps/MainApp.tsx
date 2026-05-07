import {
  tokens,
  makeStyles,
} from '@fluentui/react-components'
import { CRUDApp, DataverseFunctionsApp, DataverseActionsApp, DataverseCustomActionsApp, DataverseCustomAPIsApp, PowerAutomateFlowsApp, DocumentationsApp, SectionCard } from '..'
import {
  DatabaseRegular,
  CodeRegular,
  FlashRegular,
  WrenchRegular,
  PlugConnectedRegular,
  ArrowRepeatAllRegular,
  BookOpenRegular,
} from '@fluentui/react-icons'
import type { Entities } from '../../generated/models/EntitiesModel'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IMainAppProps {
  view: View
  setView: (view: View) => void
  /** Entity metadata loaded at app startup. */
  entities: Entities[]
  /** Whether entity metadata is still loading. */
  entitiesLoading: boolean
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const useMainAppStyles = makeStyles({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
    gap: tokens.spacingVerticalXL,
    paddingTop: tokens.spacingVerticalL,
  },
  wrapper: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  subView: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    paddingTop: tokens.spacingVerticalL,
  },
})

// ---------------------------------------------------------------------------
// MainApp
// ---------------------------------------------------------------------------

export type View = 'crud' | 'functions' | 'actions' | 'custom-actions' | 'custom-apis' | 'flows' | 'docs' | null

export const viewLabels: Record<Exclude<View, null>, string> = {
  crud: 'CRUD Operations',
  functions: 'Dataverse Functions',
  actions: 'Dataverse Actions',
  'custom-actions': 'Dataverse Custom Actions',
  'custom-apis': 'Dataverse Custom APIs',
  flows: 'Power Automate Flows',
  docs: 'Documentation',
}

function MainAppContent({ view, setView, entities, entitiesLoading }: IMainAppProps) {
  const styles = useMainAppStyles()

  return (
    <div className={styles.wrapper}>

      {view === null && (
        <div className={styles.root}>
          <SectionCard
            title="CRUD Operations"
            description="Perform create, read, update, and delete operations against Dataverse table records via the OData v4 REST API. Demonstrates typed entity models, query options ($select, $filter, $expand), optimistic concurrency, and batch requests using the PAC CLI-generated service layer."
            category="Dataverse Table"
            icon={<DatabaseRegular />}
            onMore={() => setView('crud')}
          />

          <SectionCard
            title="Dataverse Functions"
            description="Invoke unbound Custom API Functions registered in Dataverse using HTTP GET with OData inline parameters. Functions are read-only, side-effect-free operations that return strongly-typed response payloads, demonstrated here with the WhoAmI built-in function via the PAC-generated WhoAmIService."
            category="Function"
            icon={<CodeRegular />}
            onMore={() => setView('functions')}
          />

          <SectionCard
            title="Dataverse Actions"
            description="Execute unbound Custom API Actions registered in Dataverse using HTTP POST with a structured JSON request body. Actions encapsulate business logic with side effects and return typed response objects, demonstrated here with the AddToQueue action via the PAC-generated AddToQueueService."
            category="Action"
            icon={<FlashRegular />}
            onMore={() => setView('actions')}
          />

          <SectionCard
            title="Dataverse Custom Actions"
            description="Define and invoke your own Custom API Actions registered in Dataverse. Learn how to register message endpoints, attach request/response parameters, and call them from a Code App using PAC CLI-generated typed services."
            category="Custom Action"
            icon={<WrenchRegular />}
            onMore={() => setView('custom-actions')}
          />

          <SectionCard
            title="Dataverse Custom APIs"
            description="Explore the full Custom API lifecycle: registering both Functions and Actions as first-class Dataverse API endpoints, configuring privilege and binding options, generating typed service stubs with PAC CLI, and calling them securely from a Power Apps Code App."
            category="Custom API"
            icon={<PlugConnectedRegular />}
            onMore={() => setView('custom-apis')}
          />

          <SectionCard
            title="Power Automate Flows"
            description="Trigger instant Power Automate cloud flows via their HTTP Request connector using a POST to the flow's trigger URL. Demonstrates passing structured input payloads, reading typed response bodies, and handling async flow execution patterns from within a Power Apps Code App."
            category="Instant Flow"
            icon={<ArrowRepeatAllRegular />}
            onMore={() => setView('flows')}
          />

          <SectionCard
            title="Documentation"
            description="Reference guides, API contracts, and annotated code walkthroughs for every pattern covered in this sample app. Covers Dataverse OData conventions, Custom API registration, PAC CLI commands, Power Automate HTTP trigger setup, and deployment steps."
            category="Reference"
            icon={<BookOpenRegular />}
            onMore={() => setView('docs')}
          />
        </div>
      )}

      {view !== null && (
        <div className={styles.subView}>
          {view === 'crud' && <CRUDApp entities={entities} entitiesLoading={entitiesLoading} />}
          {view === 'functions' && <DataverseFunctionsApp />}
          {view === 'actions' && <DataverseActionsApp />}
          {view === 'custom-actions' && <DataverseCustomActionsApp />}
          {view === 'custom-apis' && <DataverseCustomAPIsApp />}
          {view === 'flows' && <PowerAutomateFlowsApp />}
          {view === 'docs' && <DocumentationsApp />}
        </div>
      )}
    </div>
  )
}

export function MainApp(props: IMainAppProps) {
  return <MainAppContent {...props} />
}

