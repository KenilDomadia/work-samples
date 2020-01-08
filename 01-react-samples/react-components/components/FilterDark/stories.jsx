import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DarkBackgroundDecorator from '../helpers/DarkBackgroundDecorator';
import Filter from '.';

storiesOf('Filter Dark', module)
  .addDecorator(DarkBackgroundDecorator)
  .add('desktop Dark', () => <Container viewType="desktop" />);

const groups = [
  {
    key: 'categories',
    title: 'Categories',
    primary: true,
    items: [
      {
        key: 'salesTraining',
        title: 'Sales Training',
        count: 20
      },
      {
        key: 'productivity',
        title: 'Productivity',
        count: 12
      },
      {
        key: 'leadership',
        title: 'Leadership',
        count: 3
      },
      {
        key: 'products',
        title: 'Products',
        count: 2
      },
      {
        key: 'marketing',
        title: 'Marketing',
        count: 13
      },
      {
        key: 'salesTraining2',
        title: 'Sales Training',
        count: 1
      },
      {
        key: 'productivity2',
        title: 'Productivity',
        count: 1
      },
      {
        key: 'leadership2',
        title: 'Leadership',
        count: 1
      },
      {
        key: 'products2',
        title: 'Products',
        count: 1
      },
      {
        key: 'marketing2',
        title: 'Marketing',
        count: 1
      }
    ]
  },
  {
    key: 'language',
    title: 'Language',
    primary: true,
    items: [
      {
        key: 'language-english',
        title: 'English',
        count: 20
      },
      {
        key: 'language-japanese',
        title: 'Japanese',
        count: 12
      },
      {
        key: 'language-spanish',
        title: 'Spanish',
        count: 3
      },
      {
        key: 'language-hindi',
        title: 'Hindi',
        count: 2
      }
    ]
  },
  {
    key: 'skills',
    title: 'Skills',
    primary: true,
    items: [
      {
        key: 'skilla-a',
        title: 'Skill A',
        count: 16
      },
      {
        key: 'skilla-b',
        title: 'Skill B',
        count: 8
      },
      {
        key: 'skilla-c',
        title: 'Skill C',
        count: 4
      },
      {
        key: 'skilla-d',
        title: 'Skill D',
        count: 2
      }
    ]
  },
  {
    key: 'tags',
    title: 'Tags',
    primary: true,
    items: [
      {
        key: 'tag-a',
        title: 'Tag A',
        count: 4
      },
      {
        key: 'tag-b',
        title: 'Tag B',
        count: 8
      },
      {
        key: 'tag-c',
        title: 'Tag C',
        count: 2
      },
      {
        key: 'tag-d',
        title: 'Tag D',
        count: 16
      }
    ]
  },
  {
    key: 'users',
    title: 'Users',
    primary: false,
    items: [
      {
        key: 'user-a',
        title: 'User A',
        count: 2
      },
      {
        key: 'user-b',
        title: 'User B',
        count: 3
      },
      {
        key: 'user-c',
        title: 'User C',
        count: 1
      },
      {
        key: 'user-d',
        title: 'User D',
        count: 4
      }
    ]
  },
  {
    key: 'duration',
    title: 'Duration',
    primary: false,
    items: [
      {
        key: 'less30m',
        title: '<30 mins',
        count: 4
      },
      {
        key: 'from30to60m',
        title: '30-60 min',
        count: 3
      },
      {
        key: 'from1to3h',
        title: '1-3 hours',
        count: 2
      },
      {
        key: 'more3h',
        title: '3+ hours',
        count: 1
      }
    ]
  }
];

class Container extends React.Component {
  state = {
    selectedKeys: ['language-english', 'language-japanese'],
    selectedItemsGroupArray: [
      {
        groupIndex: 0,
        selectedItemsArray: [
          {
            key: 'salesTraining',
            title: 'Sales Training'
          },
          {
            key: 'productivity',
            title: 'Productivity'
          }
        ]
      },
      {
        groupIndex: 1,
        selectedItemsArray: [
          {
            key: 'language-english',
            title: 'English'
          },
          {
            key: 'language-japanese',
            title: 'Japanese'
          }
        ]
      }
    ]
  };

  changeHandler = (keys) => {
    this.setState({
      selectedKeys: keys
    });
  };

  changeHandler2 = (keys, item, groupIndex, remove) => {
    const selectedItemsGroupArray = this.state.selectedItemsGroupArray;
    const groupItemsObj = selectedItemsGroupArray.find((a) => a.groupIndex === groupIndex);
    if (groupItemsObj) {
      if (remove) {
        groupItemsObj.selectedItemsArray = groupItemsObj.selectedItemsArray.filter(
          (sItem) => sItem.key !== item.key
        );
      } else {
        groupItemsObj.selectedItemsArray.push(item);
      }
    } else {
      selectedItemsGroupArray.push({
        groupIndex,
        selectedItemsArray: [item]
      });
    }
    this.setState({
      selectedItemsGroupArray
    });
  };

  render() {
    const { viewType } = this.props;
    const { selectedKeys } = this.state;

    return (
      <div>
        <div style={{ width: '260px', margin: '32px' }}>
          <Filter
            viewType={viewType}
            groups={groups}
            selectedKeys={selectedKeys}
            onChange={this.changeHandler}
            onSearch={action('search')}
          />
        </div>
        <div style={{ width: '260px', margin: '32px' }}>
          GROUPS::
          <Filter
            viewType={viewType}
            groups={groups}
            selectedKeys={selectedKeys}
            selectedItemsGroupArray={this.state.selectedItemsGroupArray}
            onChange={this.changeHandler2}
            withSearch={true}
            onSearch={action('search')}
          />
        </div>
      </div>
    );
  }
}
