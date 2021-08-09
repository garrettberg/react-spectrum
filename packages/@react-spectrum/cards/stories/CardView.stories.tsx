/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {action} from '@storybook/addon-actions';
import {ActionMenu, Item} from '@react-spectrum/menu';
import {Button} from '@react-spectrum/button';
import {Card, CardView, GridLayout} from '../';
import {Content, Footer} from '@react-spectrum/view';
import {Heading, Text} from '@react-spectrum/text';
import {IllustratedMessage} from '@react-spectrum/illustratedmessage';
import {Image} from '@react-spectrum/image';
import React, {useMemo} from 'react';
import {useCollator} from '@react-aria/i18n';

let items = [
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 1, title: 'Bob 1'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 2, title: 'Joe 1'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 3, title: 'Jane 1'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 4, title: 'Bob 2'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 5, title: 'Joe 2'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 6, title: 'Jane 2'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 7, title: 'Bob 3'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 8, title: 'Joe 3'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 9, title: 'Jane 3'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 10, title: 'Bob 4'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 11, title: 'Joe 4'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 12, title: 'Jane 4'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 13, title: 'Bob 5'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 14, title: 'Joe 5'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 15, title: 'Jane 5'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 16, title: 'Bob 6'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 17, title: 'Joe 6'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 18, title: 'Jane 6'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 19, title: 'Bob 7'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 20, title: 'Joe 7'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 21, title: 'Jane 7'},
  {url: 'https://i.imgur.com/Z7AzH2c.png', width: 1024, height: 683, id: 22, title: 'Bob 8'}
];


function renderEmptyState() {
  return (
    <IllustratedMessage>
      <svg width="150" height="103" viewBox="0 0 150 103">
        <path d="M133.7,8.5h-118c-1.9,0-3.5,1.6-3.5,3.5v27c0,0.8,0.7,1.5,1.5,1.5s1.5-0.7,1.5-1.5V23.5h119V92c0,0.3-0.2,0.5-0.5,0.5h-118c-0.3,0-0.5-0.2-0.5-0.5V69c0-0.8-0.7-1.5-1.5-1.5s-1.5,0.7-1.5,1.5v23c0,1.9,1.6,3.5,3.5,3.5h118c1.9,0,3.5-1.6,3.5-3.5V12C137.2,10.1,135.6,8.5,133.7,8.5z M15.2,21.5V12c0-0.3,0.2-0.5,0.5-0.5h118c0.3,0,0.5,0.2,0.5,0.5v9.5H15.2z M32.6,16.5c0,0.6-0.4,1-1,1h-10c-0.6,0-1-0.4-1-1s0.4-1,1-1h10C32.2,15.5,32.6,15.9,32.6,16.5z M13.6,56.1l-8.6,8.5C4.8,65,4.4,65.1,4,65.1c-0.4,0-0.8-0.1-1.1-0.4c-0.6-0.6-0.6-1.5,0-2.1l8.6-8.5l-8.6-8.5c-0.6-0.6-0.6-1.5,0-2.1c0.6-0.6,1.5-0.6,2.1,0l8.6,8.5l8.6-8.5c0.6-0.6,1.5-0.6,2.1,0c0.6,0.6,0.6,1.5,0,2.1L15.8,54l8.6,8.5c0.6,0.6,0.6,1.5,0,2.1c-0.3,0.3-0.7,0.4-1.1,0.4c-0.4,0-0.8-0.1-1.1-0.4L13.6,56.1z" />
      </svg>
      <Heading>No results</Heading>
      <Content>No results found</Content>
    </IllustratedMessage>
  );
}

export default {
  title: 'CardView'
}

let onSelectionChange = action('onSelectionChange');
let actions = {
  onSelectionChange: s => onSelectionChange([...s]),
};

export const DefaultGrid = () => render({});
DefaultGrid.storyName = 'default grid layout with initialized layout';

export const DefaultGridConstructor = () => render({layout: GridLayout});
DefaultGridConstructor.storyName = 'default grid layout w/ layout constructor';

export const isLoadingNoHeight = () => renderNoItems({width: '800px', loadingState: 'loading'});
isLoadingNoHeight.storyName = 'loadingState = loading, no height';

export const isLoadingHeight = () => renderNoItems({width: '800px', height: '800px', loadingState: 'loading'});
isLoadingHeight.storyName = 'loadingState = loading, set height';

export const loadingMore = () => render({width: '800px', height: '800px', loadingState: 'loadingMore'});
loadingMore.storyName = 'loadingState = loadingMore';

export const emptyNoHeight = () => renderNoItems({width: '800px', renderEmptyState});
emptyNoHeight.storyName = 'empty state, no height';

export const emptyWithHeight = () => renderNoItems({width: '800px', height: '800px', renderEmptyState});
emptyWithHeight.storyName = 'empty, set height';


// TODO add static and dynamic, various layouts, card size, selected keys, disabled keys


function render(props) {
  let collator = useCollator({usage: 'search', sensitivity: 'base'});
  let gridLayout = useMemo(() => new GridLayout({collator}), []);
  let {
    layout = gridLayout
  } = props;

  return (
    <CardView  {...actions} {...props} layout={layout} items={items} width="800px" height="800px" UNSAFE_style={{background: 'white'}} aria-label="Test CardView" selectionMode="multiple">
      {item =>
        <Card key={item.id} textValue={item.title}>
          <Image src={item.url} />
          <Heading>{item.title}</Heading>
          <Text slot="detail">PNG</Text>
          <Content>Description</Content>
          <ActionMenu>
            <Item>Action 1</Item>
            <Item>Action 2</Item>
          </ActionMenu>
          <Footer>
            <Button variant="primary">Something</Button>
          </Footer>
        </Card>
      }
    </CardView>
  );
}

function renderNoItems(props) {
  let gridLayout = useMemo(() => new GridLayout({}), []);
  let {
    layout = gridLayout
  } = props;

  return (
    <CardView {...props} layout={layout} UNSAFE_style={{background: 'white'}} aria-label="Test CardView">
      {[]}
    </CardView>
  );
}
