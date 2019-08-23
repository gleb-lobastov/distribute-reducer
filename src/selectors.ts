import {
  TOptionalDomainCompositeState,
  IDomainPath,
  ISelectorOptions,
  IAdaptedSelectorOptions,
  IDomainStatesMapping,
} from './interface';
import {
  resolveNestedPath,
  resolveDomainPathPartitions,
  domainsFilterAdapter,
} from './utils';

export const selectNestedDomain = <IDomainState>(
  domain?: TOptionalDomainCompositeState<IDomainState>,
  pathPartition: string = '',
): TOptionalDomainCompositeState<IDomainState> => {
  if (!domain || !domain.domains) {
    return undefined;
  }
  return domain.domains[pathPartition];
};

export const selectDomain = <IDomainState>(
  rootDomain: TOptionalDomainCompositeState<IDomainState>,
  domainPath: IDomainPath,
): TOptionalDomainCompositeState<IDomainState> => {
  if (!domainPath) {
    return rootDomain;
  }
  return resolveDomainPathPartitions(domainPath).reduce(
    selectNestedDomain,
    rootDomain,
  );
};

export const selectDomainState = <IDomainState>(
  rootDomain: TOptionalDomainCompositeState<IDomainState>,
  domainPath: IDomainPath,
  { emptyState }: ISelectorOptions<IDomainState> = {},
) => {
  const domain = selectDomain(rootDomain, domainPath);
  if (!domain) {
    return emptyState;
  }
  const { domainState = emptyState } = domain;
  return domainState;
};

const selectNestedDomainStates = <IDomainState>(
  baseDomain: TOptionalDomainCompositeState<IDomainState>,
  baseDomainPath: IDomainPath = '',
  { domainsFilter, emptyState }: IAdaptedSelectorOptions<IDomainState> = {},
): IDomainStatesMapping<IDomainState> => {
  // empty state could not be specified if domain state allows {} as it value
  const domainEmptyState = emptyState as IDomainState;
  const shouldIgnoreDomain = domainsFilter
    ? !domainsFilter(baseDomainPath)
    : false;
  if (!baseDomain) {
    return shouldIgnoreDomain ? {} : { [baseDomainPath]: domainEmptyState };
  }
  const { domainState = emptyState } = baseDomain;
  // const hasNotDomainState = ;
  const baseMapping =
    shouldIgnoreDomain || domainState === undefined
      ? {}
      : { [baseDomainPath]: domainState };

  if (!baseDomain.domains) {
    return baseMapping;
  }

  const nestedStatesMappings = Object.keys(baseDomain.domains).map(
    pathPartition =>
      selectNestedDomainStates(
        selectNestedDomain(baseDomain, pathPartition),
        resolveNestedPath(baseDomainPath, pathPartition),
        {
          domainsFilter,
          emptyState,
        },
      ),
  );
  return Object.assign(baseMapping, ...nestedStatesMappings);
};

export const selectDomainStates = <IDomainState>(
  baseDomain: TOptionalDomainCompositeState<IDomainState>,
  basePath: IDomainPath = '',
  { domainsFilter, emptyState }: ISelectorOptions<IDomainState> = {},
) =>
  selectNestedDomainStates(selectDomain(baseDomain, basePath), basePath, {
    domainsFilter: domainsFilterAdapter(domainsFilter),
    emptyState,
  });
