import * as _ from 'lodash';
import * as React from 'react';
import { Pager } from 'react-bootstrap';

import * as queryString from 'query-string';

import * as search_actions from '../../actions/search';
import { PAGE_SIZE, paginate, paginateNext, paginatePrevious } from '../../constants/paginate';
import FilterList from '../../containers/filterList';
import { FilterOption } from '../../interfaces/filterOptions';
import { SearchModel } from '../../models/search';
import { DEFAULT_FILTERS } from '../filters/constants';
import Refresh from '../refresh';

import './paginatedTable.less';

export interface Props {
  count: number;
  componentList: React.ReactNode;
  componentEmpty: React.ReactNode;
  filters: boolean | string;
  fetchData: (offset: number, query?: string, sort?: string, extraFilters?: {}) => any;
  fetchSearches?: () => search_actions.SearchAction;
  createSearch?: (data: SearchModel) => search_actions.SearchAction;
  deleteSearch?: (searchId: number) => search_actions.SearchAction;
  selectSearch?: (data: SearchModel) => void;
  sortOptions?: string[];
  filterOptions?: FilterOption[];
}

interface State {
  offset: number;
  query?: string;
  sort?: string;
  extraFilters?: { [key: string]: number | boolean | string };
  shouldUpdate: boolean;
}

export default class PaginatedTable extends React.Component<Props, State> {
  // private timer: any;

  constructor(props: Props) {
    super(props);
    this.state = this.getState();
  }

  public getState() {
    const filters = {offset: 0, query: '', sort: '', extraFilters: {}, shouldUpdate: false};
    const pieces = location.href.split('?');
    if (pieces.length > 1) {
      const search = queryString.parse(pieces[1]);
      if (search.offset) {
        filters.offset = parseInt(search.offset, 10);
        delete search.offset;
      }
      if (search.query) {
        filters.query = search.query;
        delete search.query;
      }
      if (search.sort) {
        filters.sort = search.sort;
        delete search.sort;
      }
      if (Object.keys(search).length > 0) {
        filters.extraFilters = search;
      }
    }
    return filters;
  }

  public componentDidMount() {
    this.props.fetchData(
      this.state.offset,
      this.state.query,
      this.state.sort,
      this.state.extraFilters);
    // this.timer = setInterval(
    //   () => {
    //     if (this.state.shouldUpdate) {
    //       this.props.fetchData(
    //         this.state.offset,
    //         this.state.query,
    //         this.state.sort,
    //         this.state.extraFilters);
    //     }
    //   },
    //   4000);
  }

  // public componentWillUnmount() {
  //   clearInterval(this.timer);
  //   this.timer = null;
  // }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    let changed = false;
    if (this.state.offset !== prevState.offset) {
      changed = true;
    }
    if (this.state.query !== prevState.query) {
      changed = true;
      this.setState({offset: 0});
    }
    if (this.state.sort !== prevState.sort) {
      changed = true;
      this.setState({offset: 0});
    }
    if (this.state.extraFilters &&
      prevState.extraFilters &&
      !_.isEqual(this.state.extraFilters, prevState.extraFilters)) {
      changed = true;
      this.setState({offset: 0});
    }
    if (changed) {
      this.props.fetchData(
        this.state.offset,
        this.state.query,
        this.state.sort,
        this.state.extraFilters);
    }
  }

  public refresh = () => {
    this.props.fetchData(
      this.state.offset,
      this.state.query,
      this.state.sort,
      this.state.extraFilters);
  };

  public setShouldUpdate = () => {
    this.setState((prevState, prevProps) => ({
      shouldUpdate: !prevState.shouldUpdate,
    }));
  };

  public handleNextPage = () => {
    this.setState((prevState, prevProps) => ({
      offset: prevState.offset + PAGE_SIZE,
    }));
  };

  public handlePreviousPage = () => {
    this.setState((prevState, prevProps) => ({
      offset: prevState.offset - PAGE_SIZE,
    }));
  };

  public handleFilter = (query: string, sort: string, extraFilters?: { [key: string]: number | boolean | string }) => {
    this.setState((prevState, prevProps) => ({
      query,
      sort,
      extraFilters,
    }));
  };

  public render() {
    const getFilters = () => {
      if (this.props.filters === DEFAULT_FILTERS) {
        return (
          <FilterList
            query={this.state.query}
            sort={this.state.sort}
            handleFilter={(query: string, sort: string) => this.handleFilter(query, sort)}
            sortOptions={this.props.sortOptions || []}
            filterOptions={this.props.filterOptions || []}
            fetchSearches={this.props.fetchSearches}
            createSearch={this.props.createSearch}
            deleteSearch={this.props.deleteSearch}
            selectSearch={this.props.selectSearch}
          />);
      } else {
        return (null);
      }
    };

    const enableFilter = () => {
      return this.props.filters !== false;
    };

    const getContent = () => {
      return (
        <div className="paginated-table">
          {(enableFilter())
            ? <div className="row">
              <div className="col-md-11">
                {getFilters()}
              </div>
              <div className="col-md-1">
                <Refresh callback={this.refresh} pullRight={true}/>
              </div>
            </div>
            : <div className="row">
              <div className="col-md-12 button-refresh-alone">
                <Refresh callback={this.refresh} pullRight={true}/>
              </div>
            </div>
          }

          <div className="row">
            <div className="col-md-12">
              {this.props.count > 0 && this.props.componentList}
              {!this.props.count && this.props.componentEmpty}
            </div>
          </div>
          {paginate(this.props.count) &&
          <div className="row">
            <Pager>
              <Pager.Item
                onClick={this.handlePreviousPage}
                disabled={!paginatePrevious(this.state.offset)}
              >
                Previous
              </Pager.Item>{' '}
              <Pager.Item
                onClick={this.handleNextPage}
                disabled={!paginateNext(this.state.offset, this.props.count)}
              >
                Next
              </Pager.Item>
            </Pager>
          </div>
          }
        </div>
      );
    };
    return getContent();
  }
}
