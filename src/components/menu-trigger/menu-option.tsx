import {ReactNode} from 'react';
import {TouchableOpacity} from 'react-native';

export const MenuOption = ({
  onSelect,
  children,
}: {
  onSelect: () => void;
  children: ReactNode;
}) => {
  return (
    <TouchableOpacity
      onPress={onSelect}
      style={{
        padding: 5,
      }}>
      {children}
    </TouchableOpacity>
  );
};
