import React from "react";
import GraphiQL from "graphiql";
import Tools from "./Tools";
import { buildClientSchema, GraphQLSchema, parse, print } from "graphql";
import { SubscriptionClient } from "subscriptions-transport-sse";

const sseClient = new SubscriptionClient(
  `http://localhost:8080/subscriptions`,
  {}
);

const graphQLSubscriptionFetcher = (subscriptionsClient, fallbackFetcher) => {
  let activeSubscriptionId = null;

  return graphQLParams => {
    if (subscriptionsClient && activeSubscriptionId !== null) {
      subscriptionsClient.unsubscribe(activeSubscriptionId);
    }

    if (subscriptionsClient && hasSubscriptionOperation(graphQLParams)) {
      return {
        subscribe: observer => {
          observer.next(
            "Your subscription data will appear here after server publication!"
          );

          activeSubscriptionId = subscriptionsClient.subscribe(
            {
              operationName: graphQLParams.operationName,
              query: graphQLParams.query,
              variables: graphQLParams.variables
            },
            function(error, result) {
              if (error) {
                observer.error(error);
              } else {
                observer.next(result);
              }
            }
          );
        }
      };
    } else {
      return fallbackFetcher(graphQLParams);
    }
  };
};
const hasSubscriptionOperation = graphQlParams => {
  const queryDoc = parse(graphQlParams.query);

  for (let definition of queryDoc.definitions) {
    if (definition.kind === "OperationDefinition") {
      const operation = definition.operation;
      if (
        operation === "subscription" &&
        definition.name.value === graphQlParams.operationName
      ) {
        return true;
      }
    }
  }

  return false;
};
function graphQLFetcher(graphQLParams) {
  const baseUrl = "http://localhost:8080/graphql";
  return fetch(baseUrl, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(graphQLParams)
  }).then(response => response.json());
}
const fetcher = graphQLSubscriptionFetcher(sseClient, graphQLFetcher);

var search = window.location.search;
var parameters = {};
search
  .substr(1)
  .split("&")
  .forEach(function(entry) {
    var eq = entry.indexOf("=");
    if (eq >= 0) {
      parameters[decodeURIComponent(entry.slice(0, eq))] = decodeURIComponent(
        entry.slice(eq + 1)
      );
    }
  });

if (parameters.variables) {
  try {
    parameters.variables = JSON.stringify(
      JSON.parse(parameters.variables),
      null,
      2
    );
  } catch (e) {}
}

function onEditQuery(newQuery) {
  parameters.query = newQuery;
  updateURL();
}
function onEditVariables(newVariables) {
  parameters.variables = newVariables;
  updateURL();
}
function onEditOperationName(newOperationName) {
  parameters.operationName = newOperationName;
  updateURL();
}
function updateURL() {
  var newSearch =
    "?" +
    Object.keys(parameters)
      .filter(function(key) {
        return Boolean(parameters[key]);
      })
      .map(function(key) {
        return (
          encodeURIComponent(key) + "=" + encodeURIComponent(parameters[key])
        );
      })
      .join("&");
  history.replaceState(null, null, newSearch);
}

export default class GraphiQLApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toolsVisible: false
    };
  }

  render() {
    return (
      <span>
        <Tools visible={this.state.toolsVisible} />
        <GraphiQL
          fetcher={fetcher}
          editorTheme="solarized"
          query={parameters.query}
          variables={parameters.variables}
          operationName={parameters.operationName}
          onEditQuery={onEditQuery}
          onEditVariables={onEditVariables}
          onEditOperationName={onEditOperationName}
        >
          <GraphiQL.Logo>
            GraphiQL&nbsp;&nbsp;&nbsp;&nbsp;
            <GraphiQL.Button
              label="Tools"
              title="Tools"
              onClick={() =>
                this.setState({ toolsVisible: !this.state.toolsVisible })}
            />
          </GraphiQL.Logo>
        </GraphiQL>
      </span>
    );
  }
}
