import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { isEmpty, isUndefined } from 'lodash'
import ProductInfo from './ProductControl/ProductInfo';
import MetricBox from './ProductControl/MetricBox';
import {SMALL_COLORSET} from '../../../lib/report-controller/GraphColors';
import ViewTabs from '../ViewTabs';

import {
  unselectProduct,
  favoriteProduct,
  deleteFavorite,
} from '../../../reducer/product';
import {
  toggleMetric,
} from '../../../reducer/metric';
import {
  toggleModal
} from '../../../reducer/ui';
import {
  toggleHistorical,
} from '../../../reducer/graph';

import SearchIcon from 'images/Search.png';

const Container = styled.div`
  width: 437px;
  min-height: fit-content;
  height: 100%;
  border: 1px solid #BFBBF2;
  border-top: none;
  border-bottom: none;
`;
const Header = styled.div`
	height: 72px;
	font-size: 22px;
	color: #1E135F;
  padding: 20px;
  line-height: 12px;
  margin-bottom: -20px;
  margin-top: 12px;
`;
const Normal = styled.span`
	font-size: 12px;
	color: #1E135F;
`;
const EmptyList = styled.div`
	width: 100%;
	height: calc(100% - 72px);
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
  justify-content: center;
`;
const Large = styled.span`
	font-weight: bold;
	line-height: 31px;
	font-size: 21px;
	text-align: center;

	color: #1E135F;
`;
const Middle = styled.span`
	line-height: 24px;
	font-size: ${props => props.fontSize || 16}px;
	text-align: center;

	color: rgba(30, 19, 95, 0.7);
`;

const ViewToggle = styled.div`
	line-height: 24px;
	font-size: 10px;
	text-align: left;
	margin: 0px 0px;

    transition: color 0.5s;
	color: rgba(30, 19, 95, 0.7);
	.active{
    	color: rgba(30, 19, 95, 1);
	}
	.active{
    	color: rgba(30, 19, 95, 0.3);
	}
`;


const ProductStatusBar = styled.div`
  background: white;
  height: 84px;
  border-radius: 12px;
  border: 1px solid #BFBBF2;
  margin-top: 9px;

  .none {
    font-family: Open Sans;
    font-style: normal;
    font-weight: normal;
    line-height: normal;
    font-size: 12px;

    color: rgba(30, 19, 95, 0.5);
  }
`;


class SelectedProducts extends Component {


  constructor(props){
    super(props);
  }

  componentDidUpdate(prevProps) {
    const {
      activeMetrics,
      historical,
    } = this.props;

    if (activeMetrics.length === 2 && historical) {
      this.props.toggleModal('historical_err');
      //this.props.toggleHistorical(false);
    }
  }


  toggleMetric = (metric) => {
    this.props.toggleMetric({ metric });
  };

  renderItem = (info, centric) => {
    const {
      favorites,
      historical,
      selectedProducts,
      selectedMetrics,
      activeMetrics,
      graphData1,
      graphData2,
      colorUsageM,
      colorUsageP,
      deleteFavorite,
      favoriteProduct,
      unselectProduct
    } = this.props;


    const enabledMetrics = selectedMetrics.filter(sm => sm.isActive);
    let infoBlock = "";
    let collection = [];

    if(centric == 'product'){
      const type = info.type === 'category' ? 'Category' : 'Product';

      let actions = {deleteFavorite, favoriteProduct, unselectProduct};
      const favorite = favorites.filter(fav => fav.favouritable_id === info.id && fav.favouritable_type === type)[0];
      info.favorite = favorite;
      infoBlock = (<ProductInfo product={info} {... actions} />);
      collection = enabledMetrics;
    }else{
      collection = selectedProducts;
      infoBlock = 'todo';
    }


    return (
      <div key={info.id} className='mt-3 p-3'>
        {infoBlock}
        <ProductStatusBar className='d-flex align-items-center justify-content-center position-relative'>
          {isEmpty(collection) ?
              <span className='none'>Use the Add Metrics button to see how this product is performing</span>
          : collection.map(item => {
            const m = centric == 'product' ? item : info;
            const p = centric == 'product' ? info : item;

            const {metric, query_mask: queryMask} = m;
            const metricName = metric.split('.')[1];
            const id = `${metricName}_graph_${p.id}`;
            const isSelected = !isEmpty(activeMetrics.filter(am => am.id === m.id));

            const index = centric == 'product' ? metricName : p.id;
            const colorUsage = centric == 'product' ? colorUsageM : colorUsageP;
            const color = SMALL_COLORSET[colorUsage.indexOf(index)];

            console.log(color, colorUsage);

            const {product_object: product} = p;
            const gData = p.type === 'category' ? graphData1 : graphData2;
            const slice = p.type === 'category' ? p.id : product.asin1;

            let resultSet = false;
            if(gData[queryMask] && gData[queryMask][slice]){
              resultSet = gData[queryMask][slice];
            }

            const label = centric == 'product' ? m.label : (product.item_name || product.browse_node_name);

            return (
              <MetricBox metric={m} resultSet={resultSet} label={label} isSelected={isSelected} historical={historical} key={id} color={color} width={100/enabledMetrics.length} onSelect={this.toggleMetric} />
            )
          })}
        </ProductStatusBar>
      </div>
    )
  }

  onChangeCentric = (centric) => {
    this.setState({centric});
  }

  render() {
    const { selectedProducts,
      selectedMetrics,
      centric,
      categories,
      modalOpen,
      changeCentric } = this.props;

    let list = null;
    if(centric === 'product' &&  !isEmpty(selectedProducts))
    {
        list = selectedProducts.map(product => this.renderItem(product, centric));
    }else {
        const enabledMetrics = selectedMetrics.filter(sm => sm.isActive);
        list = enabledMetrics.map(metric => this.renderItem(metric, centric));
    }


    return (
      <Container>
        <Header>
          Products Selected&nbsp;<Normal>(Max 4)</Normal><br/>
          <Middle fontSize={12}>
            Select the metric column to be graphed. All products will be graphed.
          </Middle>
        </Header>
        <ViewTabs onChange={changeCentric} active='product' options={[
              {id:'product', label: 'Products'},
            {id:'metric', label:'Metrics'}
            ]}/>
        {isEmpty(selectedProducts) && <EmptyList>
          <img src={SearchIcon} />
          <div>
            <Large>You have no products selected yet.</Large><br />
            <Middle>Try using the search bar to find products.</Middle>
          </div>
        </EmptyList>
        }
        {list}
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  selectedProducts: state.product.selectedProducts,
  categories: state.product.categories,
  favorites: state.product.favorites,
  selectedMetrics: state.metric.selectedMetrics,
  activeMetrics: state.metric.activeMetrics,
  graphData1: state.graph.graphData1,
  graphData2: state.graph.graphData2,
  colorUsageM: state.metric.colorUsageStatus,
  colorUsageP: state.product.colorUsageStatus,
  historical: state.graph.historical,
});

const mapDispatchToProps = {
  unselectProduct,
  favoriteProduct,
  deleteFavorite,
  toggleMetric,
  toggleModal,
  toggleHistorical,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectedProducts);