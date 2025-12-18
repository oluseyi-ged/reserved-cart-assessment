/* eslint-disable @typescript-eslint/no-unused-vars */
import {SizedBox} from '@components';
import React, {FC} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import styles from './styles';

interface Props {
  title?: string;
  desc?: any;
  button1?: any;
  button2?: any;
  style1?: any;
  style2?: any;
  onPress1?: () => void;
  onPress2?: () => void;
  show?: boolean;
  dropPress?: any;
  afterHide?: any;
  avoidKeyboard?: boolean;
  modalStyle?: any;
}

export const ModalView: FC<Props> = ({
  title,
  desc,
  button1,
  button2,
  style1,
  style2,
  onPress1,
  onPress2,
  show = false,
  dropPress,
  afterHide,
  avoidKeyboard = true,
  modalStyle,
}) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  return (
    <Modal
      avoidKeyboard={false}
      isVisible={show}
      onBackdropPress={dropPress}
      onModalHide={afterHide}>
      <View style={[styles.modalView, modalStyle]}>
        <Text style={styles.modalHeader}>{title}</Text>
        <SizedBox height={14} />
        <View>{desc}</View>
        <SizedBox height={14} />
        <View style={styles.modalCTA}>
          <TouchableOpacity onPress={onPress1}>
            <Text style={[styles.btn1, style1]}>{button1}</Text>
          </TouchableOpacity>
          <SizedBox width={24} />
          <TouchableOpacity onPress={onPress2}>
            <Text style={[styles.btn2, style2]}>{button2}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
