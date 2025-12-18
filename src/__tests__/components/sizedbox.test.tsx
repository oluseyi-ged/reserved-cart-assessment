import {render} from '@testing-library/react-native';
import React from 'react';
import {View} from 'react-native';
import {SizedBox} from '../../components/sized-box';

describe('SizedBox', () => {
  describe('Rendering', () => {
    it('should render without props', () => {
      const {root} = render(<SizedBox />);

      expect(root).toBeTruthy();
    });

    it('should render with default empty view', () => {
      const {toJSON} = render(<SizedBox />);

      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('Width and Height', () => {
    it('should apply width', () => {
      const {UNSAFE_getByType} = render(<SizedBox width={100} />);

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({width: 100}),
      );
    });

    it('should apply height', () => {
      const {UNSAFE_getByType} = render(<SizedBox height={50} />);

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({height: 50}),
      );
    });

    it('should apply both width and height', () => {
      const {UNSAFE_getByType} = render(<SizedBox width={100} height={50} />);

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({width: 100, height: 50}),
      );
    });

    it('should handle zero width', () => {
      const {UNSAFE_getByType} = render(<SizedBox width={0} />);

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({width: 0}),
      );
    });

    it('should handle zero height', () => {
      const {UNSAFE_getByType} = render(<SizedBox height={0} />);

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({height: 0}),
      );
    });

    it('should handle large dimensions', () => {
      const {UNSAFE_getByType} = render(
        <SizedBox width={1000} height={2000} />,
      );

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({width: 1000, height: 2000}),
      );
    });

    it('should handle decimal dimensions', () => {
      const {UNSAFE_getByType} = render(
        <SizedBox width={10.5} height={20.75} />,
      );

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({width: 10.5, height: 20.75}),
      );
    });
  });

  describe('Flex', () => {
    it('should apply flex property', () => {
      const {UNSAFE_getByType} = render(<SizedBox flex={1} />);

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({flex: 1}),
      );
    });

    it('should apply flex with decimal value', () => {
      const {UNSAFE_getByType} = render(<SizedBox flex={0.5} />);

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({flex: 0.5}),
      );
    });

    it('should apply flex with zero value', () => {
      const {UNSAFE_getByType} = render(<SizedBox flex={0} />);

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({flex: 0}),
      );
    });

    it('should combine flex with width and height', () => {
      const {UNSAFE_getByType} = render(
        <SizedBox flex={1} width={100} height={50} />,
      );

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({flex: 1, width: 100, height: 50}),
      );
    });
  });

  describe('Background Color', () => {
    it('should apply backgroundColor', () => {
      const {UNSAFE_getByType} = render(<SizedBox backgroundColor="red" />);

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({backgroundColor: 'red'}),
      );
    });

    it('should apply backgroundColor with hex value', () => {
      const {UNSAFE_getByType} = render(<SizedBox backgroundColor="#FF0000" />);

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({backgroundColor: '#FF0000'}),
      );
    });

    it('should apply backgroundColor with rgba value', () => {
      const {UNSAFE_getByType} = render(
        <SizedBox backgroundColor="rgba(255, 0, 0, 0.5)" />,
      );

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({backgroundColor: 'rgba(255, 0, 0, 0.5)'}),
      );
    });

    it('should apply transparent backgroundColor', () => {
      const {UNSAFE_getByType} = render(
        <SizedBox backgroundColor="transparent" />,
      );

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({backgroundColor: 'transparent'}),
      );
    });
  });

  describe('Border Color', () => {
    it('should apply borderColor with borderWidth', () => {
      const {UNSAFE_getByType} = render(<SizedBox borderColor="blue" />);

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({borderWidth: 0.331, borderColor: 'blue'}),
      );
    });

    it('should apply borderColor with hex value', () => {
      const {UNSAFE_getByType} = render(<SizedBox borderColor="#0000FF" />);

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({borderWidth: 0.331, borderColor: '#0000FF'}),
      );
    });

    it('should not apply border styles when borderColor is not provided', () => {
      const {UNSAFE_getByType} = render(<SizedBox width={100} />);

      const view = UNSAFE_getByType(View);
      const styles = view.props.style.flat();
      const hasBorder = styles.some((s: any) => s && s.borderWidth);

      expect(hasBorder).toBe(false);
    });

    it('should apply fixed borderWidth of 0.331', () => {
      const {UNSAFE_getByType} = render(<SizedBox borderColor="red" />);

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({borderWidth: 0.331}),
      );
    });
  });

  describe('Custom Style', () => {
    it('should apply custom style object', () => {
      const customStyle = {
        padding: 10,
        margin: 5,
      };

      const {UNSAFE_getByType} = render(<SizedBox style={customStyle} />);

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining(customStyle),
      );
    });

    it('should merge custom style with other props', () => {
      const customStyle = {
        padding: 10,
        borderRadius: 8,
      };

      const {UNSAFE_getByType} = render(
        <SizedBox width={100} height={50} style={customStyle} />,
      );

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({width: 100, height: 50}),
      );
      expect(view.props.style).toContainEqual(
        expect.objectContaining(customStyle),
      );
    });

    it('should allow custom style to override default styles', () => {
      const customStyle = {
        width: 200, // Override
      };

      const {UNSAFE_getByType} = render(
        <SizedBox width={100} style={customStyle} />,
      );

      const view = UNSAFE_getByType(View);
      // Custom style comes after, so it should override
      expect(view.props.style).toContainEqual(
        expect.objectContaining({width: 200}),
      );
    });
  });

  describe('Combined Props', () => {
    it('should handle all props together', () => {
      const customStyle = {padding: 10};

      const {UNSAFE_getByType} = render(
        <SizedBox
          width={100}
          height={50}
          flex={1}
          backgroundColor="yellow"
          borderColor="black"
          style={customStyle}
        />,
      );

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({
          width: 100,
          height: 50,
          flex: 1,
          backgroundColor: 'yellow',
        }),
      );
      expect(view.props.style).toContainEqual(
        expect.objectContaining(customStyle),
      );
      expect(view.props.style).toContainEqual(
        expect.objectContaining({borderWidth: 0.331, borderColor: 'black'}),
      );
    });

    it('should prioritize borderColor over backgroundColor', () => {
      const {UNSAFE_getByType} = render(
        <SizedBox backgroundColor="red" borderColor="blue" />,
      );

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({backgroundColor: 'red'}),
      );
      expect(view.props.style).toContainEqual(
        expect.objectContaining({borderColor: 'blue', borderWidth: 0.331}),
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined props', () => {
      const {UNSAFE_getByType} = render(
        <SizedBox
          width={undefined}
          height={undefined}
          flex={undefined}
          backgroundColor={undefined}
          borderColor={undefined}
        />,
      );

      const view = UNSAFE_getByType(View);
      expect(view).toBeTruthy();
    });

    it('should handle null style', () => {
      const {UNSAFE_getByType} = render(<SizedBox style={null} />);

      const view = UNSAFE_getByType(View);
      expect(view).toBeTruthy();
    });

    it('should handle empty style object', () => {
      const {UNSAFE_getByType} = render(<SizedBox style={{}} />);

      const view = UNSAFE_getByType(View);
      expect(view).toBeTruthy();
    });

    it('should handle negative dimensions', () => {
      const {UNSAFE_getByType} = render(<SizedBox width={-10} height={-20} />);

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({width: -10, height: -20}),
      );
    });

    it('should handle very small dimensions', () => {
      const {UNSAFE_getByType} = render(
        <SizedBox width={0.001} height={0.001} />,
      );

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({width: 0.001, height: 0.001}),
      );
    });
  });

  describe('Use Cases', () => {
    it('should work as vertical spacer', () => {
      const {UNSAFE_getByType} = render(<SizedBox height={20} />);

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({height: 20}),
      );
    });

    it('should work as horizontal spacer', () => {
      const {UNSAFE_getByType} = render(<SizedBox width={20} />);

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({width: 20}),
      );
    });

    it('should work as divider with border', () => {
      const {UNSAFE_getByType} = render(
        <SizedBox height={1} borderColor="#E0E0E0" />,
      );

      const view = UNSAFE_getByType(View);
      // Check individual style objects in the array
      const styles = view.props.style;
      const hasHeight = styles.some((s: any) => s && s.height === 1);
      const hasBorder = styles.some(
        (s: any) => s && s.borderWidth === 0.331 && s.borderColor === '#E0E0E0',
      );

      expect(hasHeight).toBe(true);
      expect(hasBorder).toBe(true);
    });

    it('should work as colored separator', () => {
      const {UNSAFE_getByType} = render(
        <SizedBox height={2} backgroundColor="#CCCCCC" />,
      );

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({
          height: 2,
          backgroundColor: '#CCCCCC',
        }),
      );
    });

    it('should work as flexible spacer', () => {
      const {UNSAFE_getByType} = render(<SizedBox flex={1} />);

      const view = UNSAFE_getByType(View);
      expect(view.props.style).toContainEqual(
        expect.objectContaining({flex: 1}),
      );
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot - no props', () => {
      const {toJSON} = render(<SizedBox />);

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - with dimensions', () => {
      const {toJSON} = render(<SizedBox width={100} height={50} />);

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - with flex', () => {
      const {toJSON} = render(<SizedBox flex={1} />);

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - with colors', () => {
      const {toJSON} = render(
        <SizedBox backgroundColor="red" borderColor="blue" />,
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('should match snapshot - all props', () => {
      const {toJSON} = render(
        <SizedBox
          width={100}
          height={50}
          flex={1}
          backgroundColor="yellow"
          borderColor="black"
          style={{padding: 10}}
        />,
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });
});
