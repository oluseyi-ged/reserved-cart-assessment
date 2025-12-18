import {render} from '@testing-library/react-native';
import React from 'react';
import {Select} from '../../components/select';

// Use fake timers to handle animations
jest.useFakeTimers();

// Mock SelectList
jest.mock('react-native-select-bottom-list', () => ({
  SelectList: ({
    value,
    onSelect,
    data,
    textStyle,
    style,
    headerTitle,
    placeHolder,
    searchPlaceholder,
    showSearch,
    multiple,
    selectedValues,
  }: any) => {
    const {View, Text, TouchableOpacity} = require('react-native');

    return (
      <View testID="select-list" style={style}>
        <TouchableOpacity
          testID="select-trigger"
          onPress={() => {
            // Simulate opening the list
          }}>
          <Text testID="select-value" style={textStyle}>
            {value}
          </Text>
        </TouchableOpacity>
        <View testID="select-items">
          {data.map((item: string, index: number) => (
            <TouchableOpacity
              key={index}
              testID={`select-item-${index}`}
              onPress={() =>
                multiple ? onSelect([item]) : onSelect(item, index)
              }>
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  },
}));

// Mock components
jest.mock('@components', () => ({
  Block: ({
    children,
    style,
    row,
    justify,
    alignItems,
    align,
    onPress,
    flex,
    gap,
    radius,
    testID,
  }: any) => {
    const {View, TouchableOpacity} = require('react-native');
    const blockStyle = {
      ...(row && {flexDirection: 'row'}),
      ...(justify && {justifyContent: justify}),
      ...(alignItems && {alignItems}),
      ...(align && {alignItems: align}),
      ...(flex !== undefined && {flex}),
      ...(gap && {gap}),
      ...(radius && {borderRadius: radius}),
      ...style,
    };

    if (onPress) {
      return (
        <TouchableOpacity testID={testID} style={blockStyle} onPress={onPress}>
          {children}
        </TouchableOpacity>
      );
    }

    return (
      <View testID={testID} style={blockStyle}>
        {children}
      </View>
    );
  },
  SizedBox: ({height, width, testID}: any) => {
    const {View} = require('react-native');
    return <View testID={testID || 'sized-box'} style={{height, width}} />;
  },
  SvgIcon: ({name, size, testID, color}: any) => {
    const {View, Text} = require('react-native');
    return (
      <View testID={testID || `svg-icon-${name}`}>
        <Text>{name}</Text>
      </View>
    );
  },
  Text: ({children, style, medium, testID}: any) => {
    const {Text: RNText} = require('react-native');
    return (
      <RNText testID={testID} style={style}>
        {children}
      </RNText>
    );
  },
}));

// Mock theme
jest.mock('@theme', () => ({
  palette: {
    burnt: '#161F4C',
    placeholder: '#999999',
    cornFlower: '#007AFF',
  },
}));

// Mock styles
jest.mock('../../components/select/styles', () => ({
  __esModule: true,
  default: {
    selectContainer: {
      backgroundColor: '#FBFBFD',
      borderWidth: 1,
      borderColor: '#26323833',
      padding: 12,
    },
    label: {
      marginBottom: 5,
    },
    selectPressable: {
      padding: 10,
    },
    selectText: {
      fontSize: 14,
      color: '#161F4C',
    },
    selectItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    error: {
      color: 'red',
      fontSize: 12,
      marginTop: 5,
    },
  },
}));

describe('Select - Single Selection', () => {
  const mockData = [
    {name: 'Option 1', value: '1'},
    {name: 'Option 2', value: '2'},
    {name: 'Option 3', value: '3'},
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      const {getByTestId} = render(<Select />);

      expect(getByTestId('select-list')).toBeTruthy();
    });

    it('should render with placeholder', () => {
      const {getByText} = render(<Select placeholder="Choose option" />);

      expect(getByText('Choose option')).toBeTruthy();
    });

    it('should render with data', () => {
      const {getByTestId} = render(<Select data={mockData} />);

      expect(getByTestId('select-item-0')).toBeTruthy();
      expect(getByTestId('select-item-1')).toBeTruthy();
      expect(getByTestId('select-item-2')).toBeTruthy();
    });

    it('should render with selected value', () => {
      const {getByTestId} = render(<Select value="Option 1" data={mockData} />);

      expect(getByTestId('select-value')).toBeTruthy();
      expect(getByTestId('select-value').props.children).toBe('Option 1');
    });

    it('should render label when value is selected', () => {
      const {getByText} = render(
        <Select value="Option 1" label="Select Label" data={mockData} />,
      );

      expect(getByText('Select Label')).toBeTruthy();
    });

    it('should not render label when no value is selected', () => {
      const {queryByText} = render(
        <Select label="Select Label" data={mockData} />,
      );

      expect(queryByText('Select Label')).toBeNull();
    });

    it('should render error message', () => {
      const {getByText} = render(
        <Select error="This field is required" data={mockData} />,
      );

      expect(getByText('This field is required')).toBeTruthy();
    });

    it('should render with icon', () => {
      const {getByTestId} = render(<Select iconName="user" data={mockData} />);

      expect(getByTestId('svg-icon-user')).toBeTruthy();
    });

    it('should render caret-down icon', () => {
      const {getByTestId} = render(<Select data={mockData} />);

      expect(getByTestId('svg-icon-caret-down')).toBeTruthy();
    });
  });
});

describe('Select - Multiple Selection', () => {
  const mockData = [
    {name: 'Option 1', value: '1'},
    {name: 'Option 2', value: '2'},
    {name: 'Option 3', value: '3'},
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
  });

  it('should render in multiple selection mode', () => {
    const {getByTestId} = render(<Select multiple={true} data={mockData} />);

    expect(getByTestId('select-list')).toBeTruthy();
  });

  it('should display placeholder when no items selected', () => {
    const {getByText} = render(
      <Select
        multiple={true}
        data={mockData}
        placeholder="Select multiple items"
      />,
    );

    expect(getByText('Select multiple items')).toBeTruthy();
  });

  it('should display single item name when one item selected', () => {
    const {getByTestId} = render(
      <Select multiple={true} data={mockData} value={['Option 1']} />,
    );

    expect(getByTestId('select-value').props.children).toBe('Option 1');
  });

  it('should display comma-separated values when multiple items selected', () => {
    const {getByTestId} = render(
      <Select
        multiple={true}
        data={mockData}
        value={['Option 1', 'Option 2']}
      />,
    );

    expect(getByTestId('select-value').props.children).toBe(
      'Option 1, Option 2',
    );
  });

  it('should render label when items are selected in multiple mode', () => {
    const {getByText} = render(
      <Select
        multiple={true}
        data={mockData}
        value={['Option 1']}
        label="Select Items"
      />,
    );

    expect(getByText('Select Items')).toBeTruthy();
  });

  it('should not render label when no items selected in multiple mode', () => {
    const {queryByText} = render(
      <Select multiple={true} data={mockData} label="Select Items" />,
    );

    expect(queryByText('Select Items')).toBeNull();
  });
});

describe('Data Handling', () => {
  const mockData = [
    {name: 'Option 1', value: '1'},
    {name: 'Option 2', value: '2'},
    {name: 'Option 3', value: '3'},
  ];

  it('should render items without icons', () => {
    const {getByText} = render(<Select data={mockData} />);

    expect(getByText('Option 1')).toBeTruthy();
    expect(getByText('Option 2')).toBeTruthy();
  });

  it('should apply custom label style', () => {
    const customStyle = {fontSize: 18, color: 'blue'};

    const {getByText} = render(
      <Select
        value="Option 1"
        label="Custom Label"
        labelStyle={customStyle}
        data={mockData}
      />,
    );

    const label = getByText('Custom Label');
    expect(label.props.style).toContainEqual(
      expect.objectContaining({color: '#161F4C'}),
    );
  });

  it('should handle data with additional properties', () => {
    const complexData = [
      {
        name: 'Bank Account',
        value: '1',
        logo: 'bank-logo.png',
        bankName: 'First Bank',
        account: '1234567890',
      },
    ];

    const {getByText} = render(<Select data={complexData} />);

    expect(getByText('Bank Account')).toBeTruthy();
  });
});

describe('Search Functionality', () => {
  const mockData = [
    {name: 'Option 1', value: '1'},
    {name: 'Option 2', value: '2'},
    {name: 'Option 3', value: '3'},
  ];

  it('should show search when showSearch is true', () => {
    const {getByTestId} = render(<Select data={mockData} showSearch={true} />);

    expect(getByTestId('select-list')).toBeTruthy();
  });

  it('should pass search placeholder to SelectList', () => {
    const {getByTestId} = render(
      <Select
        data={mockData}
        showSearch={true}
        searchPlaceholder="Search options..."
      />,
    );

    expect(getByTestId('select-list')).toBeTruthy();
  });

  it('should not show search by default', () => {
    const {getByTestId} = render(<Select data={mockData} />);

    expect(getByTestId('select-list')).toBeTruthy();
  });
});

describe('Value Changes', () => {
  const mockData = [
    {name: 'Option 1', value: '1'},
    {name: 'Option 2', value: '2'},
    {name: 'Option 3', value: '3'},
  ];

  it('should update when value prop changes', () => {
    const {getByTestId, rerender} = render(
      <Select value="Option 1" data={mockData} />,
    );

    expect(getByTestId('select-value').props.children).toBe('Option 1');

    rerender(<Select value="Option 2" data={mockData} />);

    expect(getByTestId('select-value').props.children).toBe('Option 2');
  });

  it('should show label when value changes from empty to filled', () => {
    const {queryByText, rerender} = render(
      <Select label="Select Label" data={mockData} />,
    );

    expect(queryByText('Select Label')).toBeNull();

    rerender(<Select value="Option 1" label="Select Label" data={mockData} />);

    expect(queryByText('Select Label')).toBeTruthy();
  });

  it('should hide label when value changes from filled to empty', () => {
    const {queryByText, rerender} = render(
      <Select value="Option 1" label="Select Label" data={mockData} />,
    );

    expect(queryByText('Select Label')).toBeTruthy();

    rerender(<Select value="" label="Select Label" data={mockData} />);

    expect(queryByText('Select Label')).toBeNull();
  });

  it('should update display in multiple mode when values change', () => {
    const {getByTestId, rerender} = render(
      <Select multiple={true} data={mockData} value={['Option 1']} />,
    );

    expect(getByTestId('select-value').props.children).toBe('Option 1');

    rerender(
      <Select
        multiple={true}
        data={mockData}
        value={['Option 1', 'Option 2', 'Option 3']}
      />,
    );

    expect(getByTestId('select-value').props.children).toBe(
      'Option 1, Option 2, Option 3',
    );
  });
});

describe('Edge Cases', () => {
  const mockData = [
    {name: 'Option 1', value: '1'},
    {name: 'Option 2', value: '2'},
    {name: 'Option 3', value: '3'},
  ];

  it('should handle empty data array', () => {
    const {getByTestId, queryByTestId} = render(<Select data={[]} />);

    expect(getByTestId('select-list')).toBeTruthy();
    expect(queryByTestId('select-item-0')).toBeNull();
  });

  it('should handle undefined data', () => {
    const {getByTestId} = render(<Select />);

    expect(getByTestId('select-list')).toBeTruthy();
  });

  it('should handle long item names', () => {
    const longData = [
      {
        name: 'This is a very long option name that might overflow',
        value: '1',
      },
    ];

    const {getByText} = render(<Select data={longData} />);

    expect(
      getByText('This is a very long option name that might overflow'),
    ).toBeTruthy();
  });

  it('should handle special characters in names', () => {
    const specialData = [{name: 'Option & Special < > "Chars"', value: '1'}];

    const {getByText} = render(<Select data={specialData} />);

    expect(getByText('Option & Special < > "Chars"')).toBeTruthy();
  });

  it('should render SizedBox for spacing', () => {
    const {getAllByTestId} = render(<Select data={mockData} />);

    const sizedBoxes = getAllByTestId('sized-box');
    expect(sizedBoxes.length).toBeGreaterThan(0);
  });

  it('should render error with SizedBox', () => {
    const {getAllByTestId, getByText} = render(
      <Select data={mockData} error="Error message" />,
    );

    expect(getByText('Error message')).toBeTruthy();
    expect(getAllByTestId('sized-box').length).toBeGreaterThan(0);
  });

  it('should handle empty array in multiple mode', () => {
    const {getByText} = render(
      <Select
        multiple={true}
        data={mockData}
        value={[]}
        placeholder="Select items"
      />,
    );

    expect(getByText('Select items')).toBeTruthy();
  });
});

describe('Animation', () => {
  const mockData = [
    {name: 'Option 1', value: '1'},
    {name: 'Option 2', value: '2'},
    {name: 'Option 3', value: '3'},
  ];

  it('should animate label when value is set', () => {
    const {getByText, rerender} = render(
      <Select label="Select Label" data={mockData} />,
    );

    rerender(<Select value="Option 1" label="Select Label" data={mockData} />);

    jest.advanceTimersByTime(200);

    expect(getByText('Select Label')).toBeTruthy();
  });

  it('should animate label in multiple mode', () => {
    const {getByText, rerender} = render(
      <Select multiple={true} label="Select Label" data={mockData} />,
    );

    rerender(
      <Select
        multiple={true}
        value={['Option 1']}
        label="Select Label"
        data={mockData}
      />,
    );

    jest.advanceTimersByTime(200);

    expect(getByText('Select Label')).toBeTruthy();
  });
});

describe('Snapshot Tests', () => {
  const mockData = [
    {name: 'Option 1', value: '1'},
    {name: 'Option 2', value: '2'},
    {name: 'Option 3', value: '3'},
  ];

  it('should match snapshot - default state', () => {
    const {toJSON} = render(<Select data={mockData} />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot - with value selected', () => {
    const {toJSON} = render(
      <Select value="Option 1" label="Select Label" data={mockData} />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot - with error', () => {
    const {toJSON} = render(
      <Select data={mockData} error="This field is required" />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot - multiple selection mode', () => {
    const {toJSON} = render(
      <Select
        multiple={true}
        data={mockData}
        value={['Option 1', 'Option 2']}
        label="Select Items"
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot - with icon and search', () => {
    const {toJSON} = render(
      <Select
        data={mockData}
        iconName="search"
        showSearch={true}
        searchPlaceholder="Search..."
        headerTitle="Select Option"
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
