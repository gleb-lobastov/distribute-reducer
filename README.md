This is wrapper over arbitrary redux reducer.

It allows to dynamically apply the same reducer to different parts of the state. Each part is stored in own place, which called here "domain". Domains have a hierarchical structure and could be nested. Also, domains could be grouped by their names, through "domainsFilter" option. One action could be reduced both, to a single domain or group of domains.

Also, lib provides selectors for domain states.

It's originally written to automate HTTP requests state tracking: each request keep its state (success/fail, result, error, etc.) in own domain. Domain path is specified by an app developer. So a developer could select isPending state for one or group (related to the same page, fetch/submit, etc.) of requests and show loader, or select error state and show error modal. Requests could be invalidated by domain individually or in the group through domainsFilter

Usage example:

```ecmascript 6
import { combineReducers } from 'redux';
import { distributeReducer } from 'distributeReducer';
import originalReducer from 'originalReducer';

export default combineReducers({
  distributedState: distributeReducer(originalReducer)
})
```

The wrapped reducer will accept additional params in action:

```ecmascript 6

const action = {
   meta: {
      domain: 'path.with.dot.separator',
      distributeReducerOptions: {
         maxNestingDepth: 0,
         domainsFilter: '.*',
      },
   }
}
```

For example, how to select the state of any fetch request on one page to show appropriate loader:

```ecmascript 6

const stateExample = {
  domains: {
    myPage: {
      domains: {
        fetchData: {
          domainState: { isPending: true },
        },
        fetchPics: {
          domainState: { isPending: false },
        },
        submitForm: {
          domainState: { isPending: false },
        },
      },
    },
  },
};

const fetchStates = selectDomainStates(
  stateExample,
  'myPage',
  { domainsFilter: 'fetch' }
);

console.log(fetchStates);
// {
//   'myPage.fetchData': { isPending: true },
//   'myPage.fetchPics': { isPending: false }
// }

const hasPendingRequest = Object.values(fetchStates).some(
  ({ isPending }) => isPending
);

console.log(hasPendingRequest);
// true

```

A domain path is a path in the state to where original reducer will be applied.

maxNestingDepth - specifies relative depth in domains hierarchy to apply reducer. By default, it is 0, which means, that only reducer will be applied only on the specified domain, not nested domains. To not to make any restriction just pass maxNestingDepth: Infinity
domainsFilter - string represents regexp, which will filter domains by domainPath

Note: these additional fields are consumed in the wrapper and not pass to the original reducer.
