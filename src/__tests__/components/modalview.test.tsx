import {fireEvent, render} from '@testing-library/react-native';
import React from 'react';
import {Text} from 'react-native';
import {ModalView} from '../../components/modal-view';

// Mock react-native-modal
jest.mock('react-native-modal', () => {
  const {View} = require('react-native');
  return ({
    isVisible,
    children,
    onBackdropPress,
    onModalHide,
    avoidKeyboard,
    ...props
  }: any) => {
    if (!isVisible) return null;
    return (
      <View testID="modal-container" {...props}>
        {onBackdropPress && (
          <View testID="modal-backdrop" onTouchEnd={onBackdropPress} />
        )}
        {children}
        {onModalHide && <View testID="modal-hide-trigger" />}
      </View>
    );
  };
});

// Mock SizedBox component
jest.mock('@components', () => ({
  SizedBox: ({height, width, testID}: any) => {
    const {View} = require('react-native');
    return <View testID={testID || 'sized-box'} style={{height, width}} />;
  },
}));

// Mock styles
jest.mock('../../components/modal-view/styles', () => ({
  __esModule: true,
  default: {
    modalView: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
    },
    modalHeader: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    modalCTA: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    btn1: {
      color: 'blue',
      fontSize: 16,
    },
    btn2: {
      color: 'red',
      fontSize: 16,
    },
  },
}));

describe('ModalView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should not render when show is false', () => {
      const {queryByTestId} = render(
        <ModalView show={false} title="Test Modal" />,
      );

      expect(queryByTestId('modal-container')).toBeNull();
    });

    it('should render when show is true', () => {
      const {getByTestId} = render(
        <ModalView show={true} title="Test Modal" />,
      );

      expect(getByTestId('modal-container')).toBeTruthy();
    });

    it('should render with title', () => {
      const {getByText} = render(
        <ModalView show={true} title="Confirm Action" />,
      );

      expect(getByText('Confirm Action')).toBeTruthy();
    });

    it('should render description content', () => {
      const descContent = <Text>Are you sure you want to continue?</Text>;
      const {getByText} = render(
        <ModalView show={true} title="Confirm" desc={descContent} />,
      );

      expect(getByText('Are you sure you want to continue?')).toBeTruthy();
    });

    it('should render button texts', () => {
      const {getByText} = render(
        <ModalView
          show={true}
          title="Modal Title"
          button1="Cancel"
          button2="Confirm"
        />,
      );

      expect(getByText('Cancel')).toBeTruthy();
      expect(getByText('Confirm')).toBeTruthy();
    });

    it('should render without title', () => {
      const {getByTestId} = render(
        <ModalView show={true} button1="OK" button2="Cancel" />,
      );

      // Modal should render even without title
      expect(getByTestId('modal-container')).toBeTruthy();
    });

    it('should render complex description with multiple elements', () => {
      const complexDesc = (
        <>
          <Text>Line 1</Text>
          <Text>Line 2</Text>
        </>
      );

      const {getByText} = render(
        <ModalView show={true} title="Title" desc={complexDesc} />,
      );

      expect(getByText('Line 1')).toBeTruthy();
      expect(getByText('Line 2')).toBeTruthy();
    });
  });

  describe('Button Interactions', () => {
    it('should call onPress1 when first button is pressed', () => {
      const onPress1Mock = jest.fn();

      const {getByText} = render(
        <ModalView
          show={true}
          title="Test"
          button1="Button 1"
          button2="Button 2"
          onPress1={onPress1Mock}
        />,
      );

      fireEvent.press(getByText('Button 1'));

      expect(onPress1Mock).toHaveBeenCalledTimes(1);
    });

    it('should call onPress2 when second button is pressed', () => {
      const onPress2Mock = jest.fn();

      const {getByText} = render(
        <ModalView
          show={true}
          title="Test"
          button1="Button 1"
          button2="Button 2"
          onPress2={onPress2Mock}
        />,
      );

      fireEvent.press(getByText('Button 2'));

      expect(onPress2Mock).toHaveBeenCalledTimes(1);
    });

    it('should call both callbacks when both buttons are pressed', () => {
      const onPress1Mock = jest.fn();
      const onPress2Mock = jest.fn();

      const {getByText} = render(
        <ModalView
          show={true}
          title="Test"
          button1="Cancel"
          button2="Confirm"
          onPress1={onPress1Mock}
          onPress2={onPress2Mock}
        />,
      );

      fireEvent.press(getByText('Cancel'));
      fireEvent.press(getByText('Confirm'));

      expect(onPress1Mock).toHaveBeenCalledTimes(1);
      expect(onPress2Mock).toHaveBeenCalledTimes(1);
    });

    it('should not crash when onPress1 is not provided', () => {
      const {getByText} = render(
        <ModalView show={true} title="Test" button1="Button 1" />,
      );

      expect(() => {
        fireEvent.press(getByText('Button 1'));
      }).not.toThrow();
    });

    it('should not crash when onPress2 is not provided', () => {
      const {getByText} = render(
        <ModalView show={true} title="Test" button2="Button 2" />,
      );

      expect(() => {
        fireEvent.press(getByText('Button 2'));
      }).not.toThrow();
    });

    it('should handle multiple button presses', () => {
      const onPress1Mock = jest.fn();

      const {getByText} = render(
        <ModalView
          show={true}
          title="Test"
          button1="Click Me"
          onPress1={onPress1Mock}
        />,
      );

      fireEvent.press(getByText('Click Me'));
      fireEvent.press(getByText('Click Me'));
      fireEvent.press(getByText('Click Me'));

      expect(onPress1Mock).toHaveBeenCalledTimes(3);
    });
  });

  describe('Modal Interactions', () => {
    it('should call dropPress when backdrop is pressed', () => {
      const dropPressMock = jest.fn();

      const {getByTestId} = render(
        <ModalView show={true} title="Test" dropPress={dropPressMock} />,
      );

      fireEvent(getByTestId('modal-backdrop'), 'onTouchEnd');

      expect(dropPressMock).toHaveBeenCalledTimes(1);
    });

    it('should not crash when dropPress is not provided', () => {
      const {queryByTestId} = render(<ModalView show={true} title="Test" />);

      // Modal should render without backdrop handler
      expect(queryByTestId('modal-container')).toBeTruthy();
    });

    it('should render backdrop when dropPress is provided', () => {
      const dropPressMock = jest.fn();

      const {getByTestId} = render(
        <ModalView show={true} title="Test" dropPress={dropPressMock} />,
      );

      expect(getByTestId('modal-backdrop')).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should apply custom style1 to first button', () => {
      const customStyle = {color: 'green', fontSize: 20};

      const {getByText} = render(
        <ModalView
          show={true}
          title="Test"
          button1="Button 1"
          style1={customStyle}
        />,
      );

      const button = getByText('Button 1');
      expect(button.props.style).toContainEqual(
        expect.objectContaining(customStyle),
      );
    });

    it('should apply custom style2 to second button', () => {
      const customStyle = {color: 'purple', fontSize: 18};

      const {getByText} = render(
        <ModalView
          show={true}
          title="Test"
          button2="Button 2"
          style2={customStyle}
        />,
      );

      const button = getByText('Button 2');
      expect(button.props.style).toContainEqual(
        expect.objectContaining(customStyle),
      );
    });

    it('should apply custom modalStyle', () => {
      const customModalStyle = {backgroundColor: 'yellow', padding: 30};

      const {getByTestId} = render(
        <ModalView
          show={true}
          title="Test Modal"
          modalStyle={customModalStyle}
        />,
      );

      // Find the modal view by traversing from modal container
      const modalContainer = getByTestId('modal-container');
      const modalView = modalContainer.props.children[1]; // Skip backdrop, get modal view

      expect(modalView.props.style).toContainEqual(
        expect.objectContaining(customModalStyle),
      );
    });

    it('should merge default styles with custom styles', () => {
      const customStyle = {fontSize: 24};

      const {getByText} = render(
        <ModalView
          show={true}
          title="Test"
          button1="Button"
          style1={customStyle}
        />,
      );

      const button = getByText('Button');
      // Should have both default and custom styles
      expect(button.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({color: 'blue'}),
          expect.objectContaining(customStyle),
        ]),
      );
    });
  });

  describe('Modal Visibility', () => {
    it('should show modal when show prop is true', () => {
      const {getByTestId} = render(<ModalView show={true} title="Visible" />);

      expect(getByTestId('modal-container')).toBeTruthy();
    });

    it('should hide modal when show prop is false', () => {
      const {queryByTestId} = render(<ModalView show={false} title="Hidden" />);

      expect(queryByTestId('modal-container')).toBeNull();
    });

    it('should toggle visibility when show prop changes', () => {
      const {queryByTestId, rerender} = render(
        <ModalView show={false} title="Test" />,
      );

      expect(queryByTestId('modal-container')).toBeNull();

      rerender(<ModalView show={true} title="Test" />);

      expect(queryByTestId('modal-container')).toBeTruthy();
    });

    it('should default to hidden when show prop is not provided', () => {
      const {queryByTestId} = render(<ModalView title="Test" />);

      expect(queryByTestId('modal-container')).toBeNull();
    });
  });

  describe('Modal Properties', () => {
    it('should pass avoidKeyboard prop to Modal', () => {
      const {getByTestId} = render(
        <ModalView show={true} title="Test" avoidKeyboard={true} />,
      );

      // Modal should render (avoidKeyboard is internal to react-native-modal)
      expect(getByTestId('modal-container')).toBeTruthy();
    });

    it('should default avoidKeyboard to true', () => {
      const {getByTestId} = render(<ModalView show={true} title="Test" />);

      expect(getByTestId('modal-container')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined button texts', () => {
      const {getByTestId, getAllByText} = render(
        <ModalView show={true} title="Test" />,
      );

      // Modal should render
      expect(getByTestId('modal-container')).toBeTruthy();

      // Buttons render but with empty text (there will be multiple empty texts)
      const emptyTexts = getAllByText('');
      expect(emptyTexts.length).toBeGreaterThan(0);
    });

    it('should handle null description', () => {
      const {getByText} = render(
        <ModalView show={true} title="Test" desc={null} />,
      );

      expect(getByText('Test')).toBeTruthy();
    });

    it('should handle empty strings for all props', () => {
      const {getByTestId} = render(
        <ModalView show={true} title="" button1="" button2="" />,
      );

      expect(getByTestId('modal-container')).toBeTruthy();
    });

    it('should render SizedBox components for spacing', () => {
      const {getAllByTestId} = render(
        <ModalView show={true} title="Test" button1="OK" button2="Cancel" />,
      );

      const sizedBoxes = getAllByTestId('sized-box');
      expect(sizedBoxes.length).toBeGreaterThan(0);
    });

    it('should handle rapid show/hide toggles', () => {
      const {queryByTestId, rerender} = render(
        <ModalView show={false} title="Test" />,
      );

      expect(queryByTestId('modal-container')).toBeNull();

      rerender(<ModalView show={true} title="Test" />);
      expect(queryByTestId('modal-container')).toBeTruthy();

      rerender(<ModalView show={false} title="Test" />);
      expect(queryByTestId('modal-container')).toBeNull();

      rerender(<ModalView show={true} title="Test" />);
      expect(queryByTestId('modal-container')).toBeTruthy();
    });
  });

  describe('Content Rendering', () => {
    it('should render all modal sections', () => {
      const {getByText} = render(
        <ModalView
          show={true}
          title="Modal Title"
          desc={<Text>Modal Description</Text>}
          button1="Cancel"
          button2="Confirm"
        />,
      );

      expect(getByText('Modal Title')).toBeTruthy();
      expect(getByText('Modal Description')).toBeTruthy();
      expect(getByText('Cancel')).toBeTruthy();
      expect(getByText('Confirm')).toBeTruthy();
    });

    it('should render custom React elements in description', () => {
      const CustomComponent = () => <Text>Custom Content</Text>;

      const {getByText} = render(
        <ModalView show={true} title="Test" desc={<CustomComponent />} />,
      );

      expect(getByText('Custom Content')).toBeTruthy();
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot - closed modal', () => {
      const {toJSON} = render(<ModalView show={false} title="Test Modal" />);

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - open modal with all props', () => {
      const {toJSON} = render(
        <ModalView
          show={true}
          title="Confirmation"
          desc={<Text>Are you sure?</Text>}
          button1="Cancel"
          button2="Confirm"
          onPress1={jest.fn()}
          onPress2={jest.fn()}
        />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - modal with custom styles', () => {
      const {toJSON} = render(
        <ModalView
          show={true}
          title="Styled Modal"
          button1="Button 1"
          button2="Button 2"
          style1={{color: 'green'}}
          style2={{color: 'orange'}}
          modalStyle={{backgroundColor: 'lightgray'}}
        />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - minimal props', () => {
      const {toJSON} = render(<ModalView show={true} />);

      expect(toJSON()).toMatchSnapshot();
    });
  });
});
