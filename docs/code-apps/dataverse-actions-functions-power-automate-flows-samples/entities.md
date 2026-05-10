# Entities

Reference for all PAC CLI-generated Dataverse entity models used in the `dataverse-actions-functions-power-automate-flows-samples` app. Each entry describes the Dataverse entity, its OData endpoint, the TypeScript interfaces exposed by the generated model, and the key fields used in the sample.

> **Model file convention**
> Every model exports two interfaces: `XxxBase` (write/create shape) and `Xxx extends XxxBase` (read shape with computed/lookup name fields). Use `XxxBase` when constructing POST/PATCH bodies; use `Xxx` when consuming GET responses.
> Shared query option types live in `CommonModels.ts`.

---

## Table of Contents

| Entity | Logical Name | OData Collection |
|---|---|---|
| [Aadusers](#aadusers) | `aaduser` (via MS Graph) | `aadusers` |
| [Accounts](#accounts) | `account` | `accounts` |
| [Aidevme_appeventlogs](#aidevme_appeventlogs) | `aidevme_appeventlog` | `aidevme_appeventlogs` |
| [Aidevme_codeappssamplesconfigurationsettings](#aidevme_codeappssamplesconfigurationsettings) | `aidevme_codeappssamplesconfigurationsetting` | `aidevme_codeappssamplesconfigurationsettings` |
| [Appointments](#appointments) | `appointment` | `appointments` |
| [Businessunits](#businessunits) | `businessunit` | `businessunits` |
| [CommonModels](#commonmodels) | — | — |
| [Contacts](#contacts) | `contact` | `contacts` |
| [Emails](#emails) | `email` | `emails` |
| [Entities](#entities) | `entity` (metadata) | `entities` |
| [Environmentvariabledefinitions](#environmentvariabledefinitions) | `environmentvariabledefinition` | `environmentvariabledefinitions` |
| [Environmentvariablevalues](#environmentvariablevalues) | `environmentvariablevalue` | `environmentvariablevalues` |
| [Follow_upflow](#follow_upflow) | Power Automate flow | — |
| [Leads](#leads) | `lead` | `leads` |
| [Opportunities](#opportunities) | `opportunity` | `opportunities` |
| [Organizations](#organizations) | `organization` | `organizations` |
| [Savedqueries](#savedqueries) | `savedquery` | `savedqueries` |
| [Systemforms](#systemforms) | `systemform` | `systemforms` |
| [Systemusers](#systemusers) | `systemuser` | `systemusers` |
| [Tasks](#tasks) | `task` | `tasks` |
| [Teams](#teams) | `team` | `teams` |
| [Transactioncurrencies](#transactioncurrencies) | `transactioncurrency` | `transactioncurrencies` |
| [Usersettingscollection](#usersettingscollection) | `usersettings` | `usersettingscollections` |
| [Workflows](#workflows) | `workflow` | `workflows` |

---

## Aadusers

**Model file:** `AadusersModel.ts`  
**Source:** Microsoft Graph API (`/v1.0/users`) — surfaced in Dataverse via the AAD user virtual entity.  
**Primary key:** `aaduserid` / `id`

Represents an Azure Active Directory user. Read-only in Dataverse; data originates from Entra ID (Azure AD). Used in the sample to resolve user display names and UPNs.

### Interface: `Aadusers`

| Field | Type | Notes |
|---|---|---|
| `aaduserid` | `string` | Dataverse virtual entity key |
| `id` | `string` | Entra ID object ID |
| `displayname` | `string?` | Full display name |
| `givenname` | `string?` | First name |
| `surname` | `string?` | Last name |
| `mail` | `string?` | Primary email |
| `userprincipalname` | `string?` | UPN (login name) |
| `jobtitle` | `string?` | Job title |
| `officelocation` | `string?` | Office location |
| `mobilephone` | `string?` | Mobile number |
| `businessphones` | `string?` | Comma-separated business phones |
| `accountenabled` | `boolean?` | Whether the account is enabled |
| `usertype` | `string?` | `Member` or `Guest` |
| `companyname` | `string?` | Organisation name |
| `city` / `postalcode` / `streetaddress` | `string?` | Address fields |
| `preferredlanguage` | `string?` | IETF language tag |
| `createddatetime` | `string?` | ISO 8601 creation date |

---

## Accounts

**Model file:** `AccountsModel.ts`  
**OData:** `/api/data/v9.2/accounts`  
**Primary key:** `accountid`

Standard Dataverse CRM entity for organisations / companies. One of the most heavily featured entities in the sample — used in the CRUD app and the Power Automate Follow-up flow trigger.

### Key enumerations

| Type | Values |
|---|---|
| `Accountsstatecode` | `0=Active`, `1=Inactive` |
| `Accountsstatuscode` | `1=Active`, `2=Inactive` |
| `Accountscustomertypecode` | `Competitor`, `Consultant`, `Customer`, `Investor`, `Partner`, `Influencer`, `Press`, `Prospect`, `Reseller`, `Supplier`, `Vendor`, `Other` |
| `Accountsindustrycode` | 33 industry values (Accounting → Wholesale) |
| `Accountsownershipcode` | `Public`, `Private`, `Subsidiary`, `Other` |
| `Accountspreferredcontactmethodcode` | `Any`, `Email`, `Phone`, `Fax`, `Mail` |
| `Accountspaymenttermscode` | `Net30`, `2/10 Net30`, `Net45`, `Net60` |

### Interface: `AccountsBase` (write)

Required fields: `accountid`, `name`, `statecode`, `ownerid`, `owneridtype`.  
Notable optional fields: `emailaddress1`, `telephone1`, `websiteurl`, `revenue`, `numberofemployees`, `description`, `industrycode`, `customertypecode`, address blocks (`address1_*`, `address2_*`).

### Interface: `Accounts` (read, extends `AccountsBase`)

Adds computed fields: `createdbyname`, `modifiedbyname`, `owneridname`, `owningbusinessunitname`, `statecodename`, `statuscodename`, `industrycodename`, aging fields (`aging30`, `aging60`, `aging90`), exchange rate, and `_*_value` lookup GUID fields.

---

## Aidevme_appeventlogs

**Model file:** `Aidevme_appeventlogsModel.ts`  
**OData:** `/api/data/v9.2/aidevme_appeventlogs`  
**Primary key:** `aidevme_appeventlogid`

Custom elastic table used to record telemetry events raised by the Code App (page views, button clicks, API calls, errors, custom events). Elastic tables support time-to-live (`ttlinseconds`) and partition keys (`partitionid`).

### Key enumerations

| Type | Values |
|---|---|
| `Aidevme_appeventlogseventtype` | `1=PageView`, `2=ButtonClick`, `3=ApiCall`, `4=Error`, `5=Custom` |
| `Aidevme_appeventlogsstatus` | `1=Success`, `2=Failure`, `3=Warning` |

### Interface: `Aidevme_appeventlogsBase` (write)

| Field | Type | Notes |
|---|---|---|
| `aidevme_appeventlogid` | `string` | Primary key |
| `aidevme_name` | `string?` | Event name/title |
| `aidevme_eventtype` | `Aidevme_appeventlogseventtype?` | Event category |
| `aidevme_entitylogicalname` | `string?` | Target entity logical name |
| `aidevme_entityid` | `string?` | Target record GUID |
| `aidevme_sessionid` | `string?` | Client session identifier |
| `aidevme_properties` | `string?` | JSON blob of extra properties |
| `aidevme_durationms` | `number?` | Duration in milliseconds |
| `aidevme_status` | `Aidevme_appeventlogsstatus?` | Outcome status |
| `aidevme_errormessage` | `string?` | Error details if `status=Failure` |
| `ttlinseconds` | `number?` | Elastic table TTL |
| `partitionid` | `string?` | Elastic table partition key |
| `aidevme_userid@odata.bind` | `string?` | Lookup to `systemuser` |

### Interface: `Aidevme_appeventlogs` (read)

Adds: `aidevme_useridname`, `_aidevme_userid_value`, `createdon`, `modifiedon`.

---

## Aidevme_codeappssamplesconfigurationsettings

**Model file:** `Aidevme_codeappssamplesconfigurationsettingsModel.ts`  
**OData:** `/api/data/v9.2/aidevme_codeappssamplesconfigurationsettings`  
**Primary key:** `aidevme_codeappssamplesconfigurationsettingid`

Custom solution-aware entity that stores typed key/value configuration pairs for the sample app. Supports 14 value types including JSON, XML, secret, and GUID.

### Key enumerations

| Type | Values |
|---|---|
| `Aidevme_codeappssamplesconfigurationsettingsstatecode` | `0=Active`, `1=Inactive` |
| `Aidevme_codeappssamplesconfigurationsettingsaidevme_configurationvaluetype` | `Text`, `MultilineText`, `Integer`, `Decimal`, `Float`, `Currency`, `Boolean`, `CSV`, `JSON`, `XML`, `URL`, `GUID`, `DateTime`, `Secret` |

### Interface: `Aidevme_codeappssamplesconfigurationsettingsBase` (write)

| Field | Type | Notes |
|---|---|---|
| `aidevme_key` | `string` | Configuration key (required) |
| `aidevme_value` | `string` | Value stored as string (required) |
| `aidevme_issecured` | `boolean` | Whether the value is sensitive |
| `aidevme_configurationvaluetype` | enum? | Declared type of the value |
| `aidevme_description` | `string?` | Human-readable description |
| `aidevme_isvalid` | `boolean?` | Validation flag |
| `statecode` | enum | `0=Active`, `1=Inactive` |

### Interface: `Aidevme_codeappssamplesconfigurationsettings` (read)

Adds: `createdbyname`, `modifiedbyname`, `owneridname`, `statecodename`, `aidevme_configurationvaluetypename`, `versionnumber`.

---

## Appointments

**Model file:** `AppointmentsModel.ts`  
**OData:** `/api/data/v9.2/appointments`  
**Primary key:** `activityid`

Standard Dataverse activity entity for calendar appointments. Supports recurring appointments, online meetings (Teams), and optional/required attendees.

### Key enumerations

| Type | Values |
|---|---|
| `Appointmentsstatecode` | `0=Open`, `1=Completed`, `2=Canceled`, `3=Scheduled` |
| `Appointmentsstatuscode` | `1=Free`, `2=Tentative`, `3=Completed`, `4=Canceled`, `5=Busy`, `6=OutOfOffice` |
| `Appointmentsprioritycode` | `0=Low`, `1=Normal`, `2=High` |
| `Appointmentsinstancetypecode` | `NotRecurring`, `RecurringMaster`, `RecurringInstance`, `RecurringException`, `RecurringFutureException` |
| `Appointmentsonlinemeetingtype` | `1=TeamsMeeting` |

### Interface: `AppointmentsBase` (write)

Required: `activityid`, `scheduledstart`, `scheduledend`, `subject`, `statecode`, `isdraft`, `ownerid`.  
Notable optional: `description`, `location`, `requiredattendees`, `optionalattendees`, `isonlinemeeting`, `onlinemeetingtype`, `isalldayevent`, `prioritycode`.

### Interface: `Appointments` (read)

Adds: `activitytypecode`, `instancetypecode`, `createdbyname`, `modifiedbyname`, `owneridname`, `statecodename`, `statuscodename`, `formattedscheduledstart`, `formattedscheduledend`, `attachmentcount`.

---

## Businessunits

**Model file:** `BusinessunitsModel.ts`  
**OData:** `/api/data/v9.2/businessunits`  
**Primary key:** `businessunitid`

Represents a node in the Power Platform organisation hierarchy. Business units are used to segment data visibility and assign security roles.

### Interface: `BusinessunitsBase` (write)

Required: `businessunitid`, `name`, `isdisabled`, `ParentBusinessUnitId@odata.bind`.  
Notable optional: `emailaddress`, `websiteurl`, `description`, `costcenter`, `divisionname`, address blocks (`address1_*`, `address2_*`).

### Interface: `Businessunits` (read)

Adds: `createdbyname`, `modifiedbyname`, `parentbusinessunitidname`, `organizationidname`, `disabledreason`, `exchangerate`, `versionnumber`.

---

## CommonModels

**Model file:** `CommonModels.ts`  
**Purpose:** Shared query option interfaces used when calling generated service methods.

### Interface: `IGetOptions`

| Field | Type | Notes |
|---|---|---|
| `select` | `string[]?` | OData `$select` columns |

### Interface: `IGetAllOptions`

| Field | Type | Notes |
|---|---|---|
| `select` | `string[]?` | OData `$select` columns |
| `filter` | `string?` | OData `$filter` expression |
| `orderBy` | `string[]?` | OData `$orderby` columns |
| `top` | `number?` | OData `$top` row limit |
| `skip` | `number?` | OData `$skip` offset |
| `skipToken` | `string?` | Server-side paging token |
| `maxPageSize` | `number?` | `Prefer: odata.maxpagesize` header value |

---

## Contacts

**Model file:** `ContactsModel.ts`  
**OData:** `/api/data/v9.2/contacts`  
**Primary key:** `contactid`

Standard Dataverse CRM entity for individual people associated with accounts. Used in the CRUD app alongside `account`.

### Key enumerations

| Type | Values |
|---|---|
| `Contactsstatecode` | `0=Active`, `1=Inactive` |
| `Contactsstatuscode` | `1=Active`, `2=Inactive` |
| `Contactsgendercode` | `1=Male`, `2=Female` |
| `Contactseducationcode` | `1=DefaultValue` |
| `Contactspreferredcontactmethodcode` | `Any`, `Email`, `Phone`, `Fax`, `Mail` |
| `Contactsfamilystatuscode` | `1=Single`, `2=Married`, `3=Divorced`, `4=Widowed` |

### Key fields (`ContactsBase`)

Required: `contactid`, `statecode`, `ownerid`.  
Notable: `firstname`, `lastname`, `fullname`, `emailaddress1`, `telephone1`, `mobilephone`, `jobtitle`, `department`, `birthdate`, `parentcustomerid@odata.bind` (link to account), `address1_*`, `address2_*`, `gendercode`, `preferredcontactmethodcode`.

### `Contacts` (read)

Adds: `fullname`, `createdbyname`, `modifiedbyname`, `owneridname`, `parentcustomeridname`, `parentcustomeridtype`, `statecodename`, `statuscodename`, `companyname`, `yomifullname`.

---

## Emails

**Model file:** `EmailsModel.ts`  
**OData:** `/api/data/v9.2/emails`  
**Primary key:** `activityid`

Standard Dataverse activity entity for email messages. Tracks sent/received emails, including direction (inbound/outbound), mime type, delivery receipts, and attachment counts.

### Key enumerations

| Type | Values |
|---|---|
| `Emailsstatecode` | `0=Open`, `1=Completed`, `2=Canceled` |
| `Emailsstatuscode` | `1=Draft`, `2=Completed`, `3=Sent`, `4=Received`, `5=Canceled`, `6=PendingSend`, `7=Sending`, `8=Failed` |
| `Emailsdirectioncode` | `false=Inbound`, `true=Outbound` |
| `Emailsprioritycode` | `0=Low`, `1=Normal`, `2=High` |

### Key fields (`EmailsBase`)

Required: `activityid`, `statecode`, `ownerid`, `isdraft`.  
Notable: `subject`, `description` (body), `directioncode`, `sender`, `torecipients`, `cc`, `bcc`, `submittedby`, `trackingtoken`, `delayedemailsendtime`, `scheduledend`.

---

## Entities

**Model file:** `EntitiesModel.ts`  
**OData:** `/api/data/v9.2/entities`  
**Primary key:** `entityid`

Dataverse entity metadata — one record per registered table. Read-only. Used at startup to populate the entity selector in the CRUD app.

### Key enumerations

| Type | Values |
|---|---|
| `Entitiescomponentstate` | `0=Published`, `1=Unpublished`, `2=Deleted`, `3=DeletedUnpublished` |

### Interface: `Entities`

| Field | Type | Notes |
|---|---|---|
| `entityid` | `string` | Primary key |
| `logicalname` | `string?` | e.g. `account` |
| `name` | `string?` | Display name |
| `collectionname` | `string?` | Plural display name |
| `logicalcollectionname` | `string?` | e.g. `accounts` |
| `entitysetname` | `string?` | OData collection name |
| `objecttypecode` | `number?` | Numeric entity type code |
| `physicalname` | `string?` | Physical table name |
| `externalname` | `string?` | External (virtual) table name |
| `isactivity` | `boolean?` | Whether it's an activity entity |
| `componentstate` | enum | Solution component state |
| `solutionid` | `string` | Owning solution GUID |
| `versionnumber` | `number?` | Row version |

---

## Environmentvariabledefinitions

**Model file:** `EnvironmentvariabledefinitionsModel.ts`  
**OData:** `/api/data/v9.2/environmentvariabledefinitions`  
**Primary key:** `environmentvariabledefinitionid`

Stores the schema of Power Platform environment variables — name, type, default value, and validation rules. Value overrides are in a separate `environmentvariablevalue` record.

### Key enumerations

| Type | Values |
|---|---|
| `Environmentvariabledefinitionstype` | `100000000=String`, `100000001=Number`, `100000002=Boolean`, `100000003=JSON`, `100000004=DataSource`, `100000005=Secret` |
| `Environmentvariabledefinitionssecretstore` | `0=AzureKeyVault`, `1=MicrosoftDataverse` |
| `Environmentvariabledefinitionsstatecode` | `0=Active`, `1=Inactive` |

### Interface: `EnvironmentvariabledefinitionsBase` (write)

| Field | Type | Notes |
|---|---|---|
| `environmentvariabledefinitionid` | `string` | Primary key |
| `displayname` | `string` | Human-readable label (required) |
| `schemaname` | `string` | API name (required) |
| `type` | enum | Value type (required) |
| `defaultvalue` | `string?` | Default value (serialised as string) |
| `description` | `string?` | Description |
| `hint` | `string?` | UI hint text |
| `isrequired` | `boolean` | Whether a value must be provided |
| `secretstore` | enum? | Storage backend for secrets |
| `learnmoreurl` | `string?` | Documentation URL |
| `statecode` | enum | Active / Inactive |

### Interface: `Environmentvariabledefinitions` (read)

Adds: `componentstate`, `ismanaged`, `solutionid`, `createdbyname`, `modifiedbyname`, `typename`, `secretstorename`, `parentdefinitionidname`, `versionnumber`.

---

## Environmentvariablevalues

**Model file:** `EnvironmentvariablevaluesModel.ts`  
**OData:** `/api/data/v9.2/environmentvariablevalues`  
**Primary key:** `environmentvariablevalueid`

Stores the runtime value override for an environment variable definition. Linked to its definition via `EnvironmentVariableDefinitionId@odata.bind`.

### Key enumerations

| Type | Values |
|---|---|
| `Environmentvariablevaluesstatecode` | `0=Active`, `1=Inactive` |

### Interface: `EnvironmentvariablevaluesBase` (write)

| Field | Type | Notes |
|---|---|---|
| `environmentvariablevalueid` | `string` | Primary key |
| `EnvironmentVariableDefinitionId@odata.bind` | `string` | Lookup to definition (required) |
| `schemaname` | `string` | Mirrors definition schema name |
| `value` | `string?` | Actual value (serialised as string) |
| `statecode` | enum | Active / Inactive |

### Interface: `Environmentvariablevalues` (read)

Adds: `componentstate`, `ismanaged`, `solutionid`, `environmentvariabledefinitionidname`, `createdbyname`, `modifiedbyname`, `versionnumber`.

---

## Follow_upflow

**Model file:** `Follow_upflowModel.ts`  
**Type:** Power Automate cloud flow registered via `pac code add-logic-flow`.  
**Trigger:** HTTP Request (Power Apps v2 connector)

Typed input/output model for the Follow-up Flow sample. The flow is invoked via `Follow_upflowService.Run()` from the generated service layer.

### Interface: `ManualTriggerInput`

| Field | Type | Notes |
|---|---|---|
| `text` | `string` | Account ID (GUID) |
| `text_1` | `string` | Follow-up description text |

### Interface: `ResponseActionOutput`

| Field | Type | Notes |
|---|---|---|
| `issuccess` | `boolean?` | Whether the flow completed successfully |
| `message` | `string?` | Status or error message from the flow |

---

## Leads

**Model file:** `LeadsModel.ts`  
**OData:** `/api/data/v9.2/leads`  
**Primary key:** `leadid`

Standard Dataverse CRM entity for unqualified prospects. Leads can be qualified into accounts, contacts, and opportunities.

### Key enumerations

| Type | Values |
|---|---|
| `Leadsstatecode` | `0=Open`, `1=Qualified`, `2=Disqualified` |
| `Leadsstatuscode` | `1=New`, `2=Contacted`, `3=Qualified`, `4=Lost`, `5=CannotContact`, `6=NoLongerInterested`, `7=Canceled` |
| `Leadsleadqualitycode` | `1=Hot`, `2=Warm`, `3=Cold` |
| `Leadsindustrycode` | 33 industry values |
| `Leadsleadsourcecode` | `Advertisement`, `EmployeeReferral`, `ExternalReferral`, `Partner`, `PublicRelations`, `Seminar`, `TradeShow`, `Web`, `WordOfMouth`, `Other` |

### Key fields (`LeadsBase`)

Required: `leadid`, `statecode`, `ownerid`, `subject`.  
Notable: `firstname`, `lastname`, `fullname`, `emailaddress1`, `telephone1`, `companyname`, `jobtitle`, `revenue`, `numberofemployees`, `industrycode`, `leadsourcecode`, `leadqualitycode`, `description`, address fields.

---

## Opportunities

**Model file:** `OpportunitiesModel.ts`  
**OData:** `/api/data/v9.2/opportunities`  
**Primary key:** `opportunityid`

Standard Dataverse CRM entity for potential sales deals. Linked to an account or contact via `parentaccountid` / `parentcontactid`.

### Key enumerations

| Type | Values |
|---|---|
| `Opportunitiesstatecode` | `0=Open`, `1=Won`, `2=Lost` |
| `Opportunitiesstatuscode` | `1=InProgress`, `2=OnHold`, `3=Won`, `4=Canceled`, `5=OutSold` |
| `Opportunitiesbudgetstatus` | `0=NoBudget`, `1=MayBuy`, `2=CanBuy`, `3=WillBuy` |
| `Opportunitiespurchasetimeframe` | `0=Immediate`, `1=ThisQuarter`, `2=NextQuarter`, `3=ThisYear`, `4=Unknown` |
| `Opportunitiessalesstage` | `0=Qualify`, `1=Develop`, `2=Propose`, `3=Close` |
| `Opportunitiesleadsourcecode` | Same 10 values as Leads |
| `Opportunitiesratingcode` | `1=Hot`, `2=Warm`, `3=Cold` |

### Key fields (`OpportunitiesBase`)

Required: `opportunityid`, `statecode`, `name`, `ownerid`.  
Notable: `estimatedvalue`, `estimatedclosedate`, `actualvalue`, `actualclosedate`, `closeprobability`, `salesstage`, `budgetstatus`, `purchasetimeframe`, `description`, `parentaccountid@odata.bind`, `parentcontactid@odata.bind`.

---

## Organizations

**Model file:** `OrganizationsModel.ts`  
**OData:** `/api/data/v9.2/organizations`  
**Primary key:** `organizationid`

Singleton record that holds organisation-wide configuration for the Dataverse environment (locale, currency, format settings, feature flags). Typically a single record per environment. Read-only in most scenarios.

### Key fields

`organizationid`, `name`, `basecurrencyid`, `defaultlanguagecode`, `localeid`, `dateformatstring`, `timeformatstring`, `currencysymbol`, `currencydecimalprecision`, `fiscalperiodtype`, `fiscalyearstartmonth`, `emailsendpollingperiod`, `maxuploadfilesize`.

---

## Savedqueries

**Model file:** `SavedqueriesModel.ts`  
**OData:** `/api/data/v9.2/savedqueries`  
**Primary key:** `savedqueryid`

Dataverse system views — reusable FetchXML queries associated with a specific entity. Power grids and lookup dialogs in model-driven apps use saved queries. Used in the sample's View Browser to inspect FetchXML and layout JSON.

### Key enumerations

| Type | Values |
|---|---|
| `Savedqueriesstatecode` | `0=Active`, `1=Inactive` |
| `Savedqueriescomponentstate` | `0=Published`, `1=Unpublished`, `2=Deleted`, `3=DeletedUnpublished` |

### Interface: `SavedqueriesBase` (write)

| Field | Type | Notes |
|---|---|---|
| `savedqueryid` | `string` | Primary key |
| `name` | `string` | View name (required) |
| `returnedtypecode` | `string` | Target entity logical name (required) |
| `querytype` | `number` | 0=Public, 1=Advanced Find, 2=Associated, 4=Quick Find, etc. |
| `fetchxml` | `string?` | FetchXML query definition |
| `layoutjson` | `string?` | Column layout as JSON |
| `layoutxml` | `string?` | Column layout as XML (legacy) |
| `isdefault` | `boolean` | Whether this is the default view |
| `isquickfindquery` | `boolean` | Whether used in Quick Find |
| `statecode` | enum | Active / Inactive |
| `canbedeleted` | `string` | Managed solution constraint |

### Interface: `Savedqueries` (read)

Adds: `componentstate`, `ismanaged`, `iscustom`, `isprivate`, `isuserdefined`, `solutionid`, `createdbyname`, `modifiedbyname`, `organizationidname`, `versionnumber`.

---

## Systemforms

**Model file:** `SystemformsModel.ts`  
**OData:** `/api/data/v9.2/systemforms`  
**Primary key:** `formid`

Represents a Dataverse system form definition (Main, Quick Create, Quick View, Dashboard, Card, etc.) for a given entity. Used in the sample to browse form definitions and inspect their JSON/XML.

### Key enumerations

| Type | Values |
|---|---|
| `Systemformstype` | `0=Dashboard`, `1=AppointmentBook`, `2=Main`, `3=MiniCampaignBO`, `4=Preview`, `5=Mobile_Express`, `6=QuickViewForm`, `7=QuickCreate`, `8=Dialog`, `9=TaskFlowForm`, `10=InteractionCentricDashboard`, `11=Card`, `12=Main_InteractiveExperience`, `13=ContextualDashboard`, `100=Other`, `101=MainBackup`, `102=AppointmentBookBackup`, `103=PowerBIDashboard` |
| `Systemformsformactivationstate` | `0=Inactive`, `1=Active` |
| `Systemformsformpresentation` | `0=ClassicForm`, `1=AirForm`, `2=ConvertedICForm` |
| `Systemformscomponentstate` | `0=Published`, `1=Unpublished`, `2=Deleted`, `3=DeletedUnpublished` |

### Interface: `SystemformsBase` (write)

| Field | Type | Notes |
|---|---|---|
| `formid` | `string` | Primary key |
| `name` | `string` | Form name (required) |
| `objecttypecode` | `string?` | Target entity logical name |
| `type` | enum? | Form type |
| `formjson` | `string` | Form definition as JSON (required) |
| `formxml` | `string` | Form definition as XML (required) |
| `formactivationstate` | enum | `0=Inactive`, `1=Active` |
| `isdefault` | `boolean` | Whether this is the default form |
| `isdesktopenabled` / `istabletenabled` | `boolean` | Device availability |

### Interface: `Systemforms` (read)

Adds: `componentstate`, `ismanaged`, `solutionid`, `organizationidname`, `publishedon`, `typename`, `formactivationstatename`, `versionnumber`.

---

## Systemusers

**Model file:** `SystemusersModel.ts`  
**OData:** `/api/data/v9.2/systemusers`  
**Primary key:** `systemuserid`

Represents a licensed Dataverse user. Used throughout the sample to resolve owner names (`createdbyname`, `owneridname`, etc.) and display user details in the CRUD table.

### Key enumerations

| Type | Values |
|---|---|
| `Systemusersstatecode` | `0=Enabled`, `1=Disabled` |
| `Systemusersinvitationstatus` | `0=InvitationNotSent`, `1=Invited`, `2=InvitationNearExpiry`, `3=InviteExpired`, `4=UserRegistered` |
| `Systemusersaccessmode` | `0=ReadWrite`, `1=Administrative`, `2=Read`, `3=SupportUser`, `4=NonInteractive`, `5=DelegatedAdmin` |
| `Systemuserslicensetype` | `0=Enterprise`, `1=Professional`, `2=Basic`, `3=DeviceEnterprise`, `4=DeviceProfessional`, `5=DeviceBasic`, `6=Essential`, `7=DeviceEssential` |

### Key fields (`SystemusersBase`)

Required: `systemuserid`, `businessunitid@odata.bind`.  
Notable: `firstname`, `lastname`, `fullname`, `internalemailaddress`, `domainname` (UPN), `title`, `jobtitle`, `mobilephone`, `accessmode`, `isdisabled`, `isintegrationuser`, `islicensed`, `issyncwithdirectory`, `defaultodbfoldername`, `azureactivedirectoryobjectid`.

---

## Tasks

**Model file:** `TasksModel.ts`  
**OData:** `/api/data/v9.2/tasks`  
**Primary key:** `activityid`

Standard Dataverse activity entity for to-do tasks. Supports percentage completion, priority, and scheduling. Can be linked to any entity via `RegardingObjectId@odata.bind`.

### Key enumerations

| Type | Values |
|---|---|
| `Tasksstatecode` | `0=Open`, `1=Completed`, `2=Canceled` |
| `Tasksstatuscode` | `2=NotStarted`, `3=InProgress`, `4=WaitingOnSomeoneElse`, `5=Completed`, `6=Canceled`, `7=Deferred` |
| `Tasksprioritycode` | `0=Low`, `1=Normal`, `2=High` |

### Key fields (`TasksBase`)

Required: `activityid`, `subject`, `statecode`, `ownerid`.  
Notable: `description`, `scheduledstart`, `scheduledend`, `actualdurationminutes`, `percentcomplete` (0–100), `prioritycode`, `category`, `subcategory`, `RegardingObjectId@odata.bind`.

---

## Teams

**Model file:** `TeamsModel.ts`  
**OData:** `/api/data/v9.2/teams`  
**Primary key:** `teamid`

Represents a Dataverse team — a collection of users that can own records and be assigned security roles. Supports owner teams, access teams, AAD security groups, and Microsoft 365 groups.

### Key enumerations

| Type | Values |
|---|---|
| `Teamsteamtype` | `0=Owner`, `1=Access`, `2=SecurityGroup`, `3=OfficeGroup` |
| `Teamsmembershiptype` | `0=MembersAndGuests`, `1=Members`, `2=Owners`, `3=Guests` |

### Interface: `TeamsBase` (write)

Required: `teamid`, `name`, `membershiptype`, `teamtype`, `AdministratorId@odata.bind`, `BusinessUnitId@odata.bind`.  
Notable optional: `description`, `emailaddress`, `azureactivedirectoryobjectid`, `yominame`.

### Interface: `Teams` (read)

Adds: `administratoridname`, `businessunitidname`, `createdbyname`, `modifiedbyname`, `organizationid`, `isdefault`, `systemmanaged`, `teamtypename`, `membershiptypename`, `exchangerate`, `versionnumber`.

---

## Transactioncurrencies

**Model file:** `TransactioncurrenciesModel.ts`  
**OData:** `/api/data/v9.2/transactioncurrencies`  
**Primary key:** `transactioncurrencyid`

Stores the currencies available in the Dataverse environment. Exchange rates are defined relative to the base currency set in the organisation record.

### Key enumerations

| Type | Values |
|---|---|
| `Transactioncurrenciescurrencytype` | `0=System`, `1=Custom` |
| `Transactioncurrenciesstatecode` | `0=Active`, `1=Inactive` |

### Interface: `TransactioncurrenciesBase` (write)

| Field | Type | Notes |
|---|---|---|
| `transactioncurrencyid` | `string` | Primary key |
| `currencyname` | `string` | Full name (required) |
| `isocurrencycode` | `string` | ISO 4217 code, e.g. `USD` (required) |
| `currencysymbol` | `string` | Symbol, e.g. `$` (required) |
| `exchangerate` | `number` | Rate relative to base currency (required) |
| `currencyprecision` | `number` | Decimal places (required) |
| `currencytype` | enum | `System` or `Custom` |
| `entityimage` | `string?` | Currency flag image (base64) |

### Interface: `Transactioncurrencies` (read)

Adds: `createdbyname`, `modifiedbyname`, `currencytypename`, `statecodename`, `entityimage_url`, `entityimage_timestamp`, `versionnumber`.

---

## Usersettingscollection

**Model file:** `UsersettingscollectionModel.ts`  
**OData:** `/api/data/v9.2/usersettingscollections`  
**Primary key:** `systemuserid`

Per-user configuration for a Dataverse environment — locale, date/time format, pagination settings, UI preferences. One record per system user.

### Key fields

`systemuserid`, `uilanguageid` (LCID), `localeid`, `timezonecode`, `dateformatcode`, `timeformatcode`, `currencysymbol`, `currencydecimalprecision`, `numericseperator`, `decimalsymbol`, `paginglimit`, `defaultdashboardid`, `homepagearea`, `homepagesubarea`, `reportscripterrors`.

---

## Workflows

**Model file:** `WorkflowsModel.ts`  
**OData:** `/api/data/v9.2/workflows`  
**Primary key:** `workflowid`

Represents a Power Automate cloud flow (or legacy workflow) registered in Dataverse. Used in the Power Automate Flows app to list available flows, display their metadata, and trigger flows registered via `pac code add-logic-flow`.

### Key enumerations

| Type | Values |
|---|---|
| `Workflowsstatecode` | `0=Draft`, `1=Activated` |
| `Workflowsstatuscode` | `1=Draft`, `2=Activated` |
| `Workflowscategory` | `0=Workflow`, `1=Dialog`, `2=BusinessRule`, `3=Action`, `4=BusinessProcessFlow`, `5=ModernFlow`, `6=DesktopFlow` |
| `Workflowsmode` | `0=Background`, `1=RealTime` |
| `Workflowsscope` | `1=User`, `2=BusinessUnit`, `3=ParentChildBusinessUnits`, `4=Organization` |
| `Workflowstype` | `1=Definition`, `2=Activation`, `3=Template` |

### Key fields (`WorkflowsBase`)

Required: `workflowid`, `name`, `statecode`.  
Notable: `category`, `mode`, `scope`, `type`, `uniquename`, `primaryentity`, `clientdata` (JSON trigger/action definition), `xaml` (legacy workflow markup).

### Interface: `Workflows` (read)

Adds: `createdbyname`, `modifiedbyname`, `owneridname`, `statecodename`, `statuscodename`, `categoryname`, `modename`, `scopename`, `typename`, `modernflowtypename`, `modernflowtype` (numeric type code), `createdon`, `modifiedon`, `versionnumber`.

> **Tip:** To detect a Power Apps v2 trigger (required for `pac code add-logic-flow` flows), check if `clientdata` contains `"PowerAppsV2"`.
