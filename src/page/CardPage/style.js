import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const TextInfo = styled.Text`
  text-align: center;
  font-size: 24px;
  color: black;
  margin-bottom: 56px;
`;

export const Button = styled.TouchableOpacity`
  width: 70%;
  margin-top: 56px;
  height: 50px;
  align-items: center;
  justify-content: center;
  background: #019eff;
  border-radius: 9px;
`;

export const TextInfoButton = styled.Text`
  text-align: center;
  font-size: 16px;
  color: white;
`;
