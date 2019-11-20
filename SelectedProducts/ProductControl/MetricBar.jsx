import React, { Component } from 'react';
import {Button, Media} from 'reactstrap';
import styled from "styled-components";
import {
  EmptyFavoriteIcon,
  FavoriteIcon2,
} from '../../common';

const MediaObject = styled(Media) `
  border-radius: 10px;
  border: 1px solid #BFBBF2;
  height: 72px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MediaBody = styled(Media) `
  height: 72px;
  margin-left: 10px;
`;

const MediaLeft = styled(Media) `
   width: 72px;
 `;

const LinkButton = styled(Button) `
  font-style: normal;
  font-weight: normal;
  line-height: normal;
  font-size: 8px;
  padding: 0px;
  color: #ED3E67;
  text-transform: none;
`;

const ProductName = styled.div`
  font-weight: bold;
  line-height: 16px;
  font-size: 12px;
  width: calc(100% - 21px);
  color: #1E135F;
  margin-top: ${props => props.margin}px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 300px;
  position: relative;
  display: inline-block;
`;

const IdText = styled.div`
  font-weight: normal;
  line-height: normal;
  font-size: 12px;
  color: rgba(30, 19, 95, 0.5);
`;

export default class ProductInfo extends Component {

  constructor(props){
    super(props);
  }

  unselectCategoryProduct = (ev) => {
    ev.stopPropagation();
    const { unselectProduct, product } = this.props;
    unselectProduct(product);
  };

  favoriteProduct = (ev) => {
    ev.stopPropagation();
    const { favoriteProduct, product } = this.props;
    favoriteProduct(product);
  };

  deleteFavorite = (ev) => {
    ev.stopPropagation();
    const { deleteFavorite, product } = this.props;
    console.log(product);
    console.log(product.favorite.id);
    deleteFavorite({id: product.favorite.id});
  };

  render() {
    const {
      favorite,
      product_object: product,
      category
    } = this.props.product;

    const {
      item_name,
      browse_node_name,
      image_url,
      asin1
    } = product;

    const isFavorite = favorite && true;
    const name = item_name || browse_node_name;
    const type = category === 'category' ? 'Category' : 'Product';

    return (
        <Media className='align-items-center'>
          <MediaLeft left>
            <MediaObject object src={image_url} width={72} height={72} alt={name} />
          </MediaLeft>
          <MediaBody body className='d-flex justify-content-between flex-column' style={{ height: 72 }}>
            <div className='d-flex justify-content-between'>
              <LinkButton color='link' onClick={this.unselectCategoryProduct}>Remove {type === 'category' ? 'Grouping' : 'Product'}</LinkButton>
              {isFavorite && <span onClick={this.deleteFavorite}><FavoriteIcon2 /></span>}
              {!isFavorite && <span onClick={this.favoriteProduct}><EmptyFavoriteIcon /></span>}
            </div>
            <ProductName margin={ type === 'category' ? -24 : 0 } title={name}>
              {name}
            </ProductName>
            <IdText>{asin1}</IdText>
          </MediaBody>
        </Media>
    )
  }
}
