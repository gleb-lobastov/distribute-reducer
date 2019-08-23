export type IDomainPath = string;
export type IDomainFilterRegexp = string;

export interface IDomainFilter {
  (domainPath: IDomainPath): boolean;
}

export interface IDistributeReducerOptions {
  maxNestingDepth?: number;
  domainsFilter?: IDomainFilterRegexp;
}

export interface IActionMeta {
  domain?: IDomainPath;
  distributeReducerOptions?: IDistributeReducerOptions;
}

export interface IAction {
  meta?: IActionMeta;
}
export interface IReducer<IState> {
  (state: IState | undefined, action: IAction): IState;
}

export interface IDomainCompositeState<IDomainState> {
  domains: { [key: string]: IDomainCompositeState<IDomainState> | undefined };
  domainState?: IDomainState;
}

export type TOptionalDomainCompositeState<IDomainState> =
  | IDomainCompositeState<IDomainState>
  | undefined;

export interface IStepParams<IDomainState> {
  domainCompositeState: IDomainCompositeState<IDomainState> | undefined;
  domainPath: IDomainPath;
  depth: number;
}

export interface IDomainStatesMapping<IDomainState> {
  [key: string]: IDomainState;
}

export interface ISelectorOptions<IDomainState> {
  emptyState?: IDomainState;
  domainsFilter?: IDomainFilterRegexp;
}

export interface IAdaptedSelectorOptions<IDomainState> {
  emptyState?: IDomainState;
  domainsFilter?: IDomainFilter;
}
