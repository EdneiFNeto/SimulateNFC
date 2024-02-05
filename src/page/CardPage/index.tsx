/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';

import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import {Animated, Easing} from 'react-native';

import {Container, TextInfo, Button, TextInfoButton} from './style';
import LottieView from 'lottie-react-native';

NfcManager.start();

enum StatusPayment {
  NONE,
  START_PAYMENT,
  SEND_PAYMENT,
  SUCCESS_PAYMENT,
  FAIL_PAYMENT,
}

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

function CardPage(): React.JSX.Element {
  const [status, setStatus] = useState<StatusPayment>(StatusPayment.NONE);
  const animationProgress = useRef(new Animated.Value(0));

  function executeAnimation() {
    Animated.timing(animationProgress.current, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }

  async function readNdef() {
    try {
      setStatus(StatusPayment.START_PAYMENT);

      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      setStatus(StatusPayment.SEND_PAYMENT);
      console.log('Tag found', tag);
      initializePayment();
    } catch (e: any) {
      console.log(e.message);
      executeAnimation();
      setStatus(StatusPayment.FAIL_PAYMENT);
      setTimeout(() => {
        resume();
      }, 3000);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  function initializePayment() {
    setTimeout(() => {
      setStatus(StatusPayment.SUCCESS_PAYMENT);
      setTimeout(() => {
        resume();
      }, 3000);
    }, 3000);
  }

  function resume() {
    setStatus(StatusPayment.NONE);
    NfcManager.cancelTechnologyRequest();
  }

  return (
    <Container>
      {status === StatusPayment.NONE && (
        <>
          <TextInfo>Ready to Scan</TextInfo>

          <LottieView
            source={require('../../resources/nfc.json')}
            style={{width: '100%', height: 200}}
            loop
          />

          <Button onPress={readNdef}>
            <TextInfoButton>Start Payment</TextInfoButton>
          </Button>
        </>
      )}

      {status === StatusPayment.START_PAYMENT && (
        <>
          <TextInfo>Start payment</TextInfo>

          <LottieView
            source={require('../../resources/nfc.json')}
            style={{width: '100%', height: 200}}
            autoPlay
            loop
          />

          <Button onPress={resume}>
            <TextInfoButton>Cancel</TextInfoButton>
          </Button>
        </>
      )}

      {status === StatusPayment.SEND_PAYMENT && (
        <>
          <LottieView
            source={require('../../resources/awaiting.json')}
            style={{width: '100%', height: 200}}
            autoPlay
            loop
          />
        </>
      )}

      {status === StatusPayment.SUCCESS_PAYMENT && (
        <>
          <TextInfo>Payment is successfull</TextInfo>

          <LottieView
            source={require('../../resources/ic_success.json')}
            style={{width: '100%', height: 300}}
            autoPlay
            loop={false}
          />
        </>
      )}

      {status === StatusPayment.FAIL_PAYMENT && (
        <>
          <TextInfo>Cancelation payment</TextInfo>

          <AnimatedLottieView
            source={require('../../resources/error.json')}
            style={{width: '100%', height: 200}}
            progress={animationProgress.current}
          />
        </>
      )}
    </Container>
  );
}

export default CardPage;
