import { compile } from "path-to-regexp";
import * as React from "react";
import { compose, gql, graphql } from "react-apollo";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { IRouterReducer } from "../../../interfaces";
import { IData } from "../../../model";
import { PATH_NAMES } from "../../../routing";
import { Loading } from "../../layout/index";
import { ILayout } from "../../layout/model";
import { ICategory } from "../../product/model";
import { Products } from "../index";

const CATEGORY_QUERY = require("./category.gql");

const styles = require("./styles.css");

interface IDataCategory extends IData {
  category: ICategory;
}

interface IConnectedCategoryProps {
  dispatch: Dispatch<{}>;
  layout: ILayout;
  data: IDataCategory;
  router: IRouterReducer;
}

interface ICategoryProps {
  id: string;
}

const options = {
  options: props => ({
    fetchPolicy: "cache-first",
    variables: {
      id: props.id
    }
  })
};

class Category extends React.Component<
  IConnectedCategoryProps & ICategoryProps,
  null
> {
  isCurrentPage = () => {
    const { id, router } = this.props;
    return router.location.pathname === compile(PATH_NAMES.category)({id});
  };

  render() {
    const { id, dispatch, layout, data } = this.props;
    const { loading, category } = data;

    if (loading === true) {
      return <Loading />;
    }

    const overflowY = this.isCurrentPage() ? "scroll" : "hidden";
    return (
      <div className={styles.category} style={{ overflowY }}>
        <div className={styles.categoryName}>
          {category.name}
        </div>
        <Products categoryId={id} />
      </div>
    );
  }
}

const mapStateToProps: any = state => ({
  layout: state.layout,
  router: state.router
});

export default compose(
  connect<IConnectedCategoryProps, {}, ICategoryProps>(mapStateToProps),
  graphql(gql(CATEGORY_QUERY), options)
)(Category);
