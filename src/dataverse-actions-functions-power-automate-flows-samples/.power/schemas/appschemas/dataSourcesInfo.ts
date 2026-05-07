/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * This file is auto-generated. Do not modify it manually.
 * Changes to this file may be overwritten.
 */

export const dataSourcesInfo = {
  "accounts": {
    "tableId": "",
    "version": "",
    "primaryKey": "accountid",
    "dataSourceType": "Dataverse",
    "apis": {}
  },
  "appointments": {
    "tableId": "",
    "version": "",
    "primaryKey": "activityid",
    "dataSourceType": "Dataverse",
    "apis": {}
  },
  "businessunits": {
    "tableId": "",
    "version": "",
    "primaryKey": "businessunitid",
    "dataSourceType": "Dataverse",
    "apis": {}
  },
  "contacts": {
    "tableId": "",
    "version": "",
    "primaryKey": "contactid",
    "dataSourceType": "Dataverse",
    "apis": {}
  },
  "transactioncurrencies": {
    "tableId": "",
    "version": "",
    "primaryKey": "transactioncurrencyid",
    "dataSourceType": "Dataverse",
    "apis": {}
  },
  "emails": {
    "tableId": "",
    "version": "",
    "primaryKey": "activityid",
    "dataSourceType": "Dataverse",
    "apis": {}
  },
  "entities": {
    "tableId": "",
    "version": "",
    "primaryKey": "entityid",
    "dataSourceType": "Dataverse",
    "apis": {}
  },
  "leads": {
    "tableId": "",
    "version": "",
    "primaryKey": "leadid",
    "dataSourceType": "Dataverse",
    "apis": {}
  },
  "opportunities": {
    "tableId": "",
    "version": "",
    "primaryKey": "opportunityid",
    "dataSourceType": "Dataverse",
    "apis": {}
  },
  "workflows": {
    "tableId": "",
    "version": "",
    "primaryKey": "workflowid",
    "dataSourceType": "Dataverse",
    "apis": {}
  },
  "tasks": {
    "tableId": "",
    "version": "",
    "primaryKey": "activityid",
    "dataSourceType": "Dataverse",
    "apis": {}
  },
  "teams": {
    "tableId": "",
    "version": "",
    "primaryKey": "teamid",
    "dataSourceType": "Dataverse",
    "apis": {}
  },
  "systemusers": {
    "tableId": "",
    "version": "",
    "primaryKey": "systemuserid",
    "dataSourceType": "Dataverse",
    "apis": {}
  },
  "aidevme_appeventlogs": {
    "tableId": "",
    "version": "",
    "primaryKey": "aidevme_appeventlogid",
    "dataSourceType": "Dataverse",
    "apis": {}
  },
  "follow_upflow": {
    "tableId": "",
    "version": "",
    "primaryKey": "",
    "dataSourceType": "Connector",
    "apis": {
      "Run": {
        "path": "/{connectionId}/triggers/manual/run",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "input",
            "in": "body",
            "required": true,
            "type": "object"
          },
          {
            "name": "api-version",
            "in": "query",
            "required": true,
            "type": "string"
          }
        ],
        "responseInfo": {
          "202": {
            "type": "void"
          }
        }
      }
    }
  }
};
