import React from 'react';
import GraphiQL from 'graphiql';
import Tools from './Tools';
import { buildClientSchema, GraphQLSchema, parse, print } from 'graphql';
import { SubscriptionClient } from 'subscriptions-transport-sse';
import ExtentionsTraceStyled from './ExtentionsTraceStyled';
import CloseButton from './CloseButton';

const sseClient = new SubscriptionClient(`${process.env.API_HOST}/subscriptions`, {});

const graphQLSubscriptionFetcher = (subscriptionsClient, fallbackFetcher) => {
  let activeSubscriptionId = null;

  return graphQLParams => {
    if (subscriptionsClient && activeSubscriptionId !== null) {
      subscriptionsClient.unsubscribe(activeSubscriptionId);
    }

    if (subscriptionsClient && hasSubscriptionOperation(graphQLParams)) {
      return {
        subscribe: observer => {
          observer.next('Your subscription data will appear here after server publication!');

          activeSubscriptionId = subscriptionsClient.subscribe(
            {
              operationName: graphQLParams.operationName,
              query: graphQLParams.query,
              variables: graphQLParams.variables,
            },
            function(error, result) {
              if (error) {
                observer.error(error);
              } else {
                observer.next(result);
              }
            },
          );
        },
      };
    } else {
      return fallbackFetcher(graphQLParams);
    }
  };
};
const hasSubscriptionOperation = graphQlParams => {
  const queryDoc = parse(graphQlParams.query);

  for (let definition of queryDoc.definitions) {
    if (definition.kind === 'OperationDefinition') {
      const operation = definition.operation;
      if (operation === 'subscription' && definition && definition.name && definition.name.value === graphQlParams.operationName) {
        return true;
      }
    }
  }

  return false;
};
function graphQLFetcher(graphQLParams) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (localStorage && localStorage['subkit-graphiql-token']) {
    try {
      headers['Authorization'] = `Bearer ${JSON.parse(localStorage['subkit-graphiql-token'])}`;
    } catch (error) {}
  }

  return fetch(`${process.env.API_HOST}/graphql`, {
    method: 'post',
    headers,
    body: JSON.stringify(graphQLParams),
  }).then(response => {
    if (response.status === 401) throw new Error(response.statusText);

    return response.json();
  });
}
const fetcher = graphQLSubscriptionFetcher(sseClient, graphQLFetcher);

var search = window.location.search;
var parameters = {};
search
  .substr(1)
  .split('&')
  .forEach(function(entry) {
    var eq = entry.indexOf('=');
    if (eq >= 0) {
      parameters[decodeURIComponent(entry.slice(0, eq))] = decodeURIComponent(entry.slice(eq + 1));
    }
  });

if (parameters.variables) {
  try {
    parameters.variables = JSON.stringify(JSON.parse(parameters.variables), null, 2);
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
    '?' +
    Object.keys(parameters)
      .filter(function(key) {
        return Boolean(parameters[key]);
      })
      .map(function(key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]);
      })
      .join('&');
  history.replaceState(null, null, newSearch);
}

export default class GraphiQLApp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      settingsButtonVisible: true,
      toolsVisible: false,
      data: {},
      extentionTraceVisible: false,
    };
  }

  render() {
    return (
      <span>
        <Tools visible={this.state.toolsVisible} onToolsClose={() => this.setState({ toolsVisible: !this.state.toolsVisible })} data={this.state.data.extensions} />
        <GraphiQL
          fetcher={params => {
            if (hasSubscriptionOperation(params))
              return fetcher(params).catch(error => {
                if (error.message === 'Unauthorized') {
                  this.setState({ settingsButtonVisible: true });
                  return { errors: [{ message: error.message }] };
                }
                throw error;
              });

            return fetcher(params)
              .then(data => {
                if (!data) return data;
                if (!data.data) return data;
                if (!data.data.__schema) this.setState({ data });
                return data;
              })
              .catch(error => {
                if (error.message === 'Unauthorized') {
                  this.setState({ settingsButtonVisible: true });
                  return { errors: [{ message: error.message }] };
                }
                throw error;
              });
          }}
          query={parameters.query}
          variables={parameters.variables}
          operationName={parameters.operationName}
          onEditQuery={onEditQuery}
          onEditVariables={onEditVariables}
          onEditOperationName={onEditOperationName}>
          <GraphiQL.Logo>
            GraphiQL&nbsp;&nbsp;&nbsp;&nbsp;
            {this.state.settingsButtonVisible && <GraphiQL.Button label="Settings" title="Settings" onClick={() => this.setState({ toolsVisible: !this.state.toolsVisible })} />}
            {<GraphiQL.Button label="Trace" title="Trace" onClick={() => this.setState({ extentionTraceVisible: !this.state.extentionTraceVisible })} />}
          </GraphiQL.Logo>
          <GraphiQL.Footer>
            {this.state.extentionTraceVisible &&
              this.state.data &&
              this.state.data.extensions && (
                <ExtentionsTraceStyled>
                  <CloseButton onClick={() => this.setState({ extentionTraceVisible: !this.state.extentionTraceVisible })}>Close</CloseButton>
                  <ul>
                    <li>Duration: {`${this.state.data.extensions.duration || '-'}`}</li>
                    <li>Persistent: {`${this.state.data.extensions.isPersistent || false}`}</li>
                    <li>
                      {this.state.data.extensions.score && (
                        <span>
                          Score/max: {this.state.data.extensions.score || '-'} / {this.state.data.extensions.scoreMax || '-'}
                        </span>
                      )}
                    </li>
                    <li>
                      Query tracing:
                      {this.state.data.extensions.trace &&
                        this.state.data.extensions.trace.execution &&
                        this.state.data.extensions.trace.execution.resolvers && (
                          <ul>
                            {this.state.data.extensions.trace.execution.resolvers.map((x, a) => {
                              if (x.path.length > 1)
                                return (
                                  <ul key={a}>
                                    <li>
                                      <div>{`${x.path.slice(1, x.path.length).join(' > ')} Duration: ${x.duration} | Score: ${x.score}`}</div>
                                    </li>
                                  </ul>
                                );

                              return (
                                <li key={a}>
                                  <div>{`${x.parentType} > ${x.path.join(' > ')} Duration: ${x.duration} | Score: ${x.score}`}</div>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                    </li>
                  </ul>
                </ExtentionsTraceStyled>
              )}
          </GraphiQL.Footer>
        </GraphiQL>
      </span>
    );
  }
}
