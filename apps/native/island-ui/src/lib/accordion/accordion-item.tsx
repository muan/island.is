import React, { useRef, useState } from "react";
import { Pressable, View, Animated, Text, LayoutAnimation, Image } from "react-native";
import check from '../../assets/icons/check.png'
import chevron from '../../assets/icons/chevron-down.png'
import styled from "styled-components/native";
import { dynamicColor } from '../../utils'
import { font } from "../../utils";

const Host = styled.View`
  border-radius: ${({ theme }) => theme.border.radius.large};
  border-width: ${({ theme }) => theme.border.width.xl}px;
  border-color: ${dynamicColor(({ theme }) => ({
    light: theme.color.mint400,
    dark: theme.color.mint400,
  }))};
  background-color: ${dynamicColor('background')};
  overflow: hidden;
  margin-bottom:  ${({ theme }) => theme.spacing[2]}px;
`;
const Header = styled.Pressable`
  padding: 10px 16px;
`;

const Title = styled.Text`
  ${font({
    fontSize: 16,
    fontWeight: '600',
  })}
`;

const Icon = styled(Animated.View)`
  height: 20px;
  width: 20px;
  margin-right: ${({ theme }) => theme.spacing[1]}px;
`;

const Chevron = styled(Animated.View)`
  height: 25px;
  width: 25px;
`;

const Content = styled.View`
  border-top-width: ${({ theme }) => theme.border.width.standard}px;
  border-top-color:rgba(204, 223, 255, 1);
`

interface AccordionItemProps {
  children: React.ReactNode;
  title: string;
  icon?: string;
}

const toggleAnimation = {
  duration: 300,
  update: {
    duration: 300,
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.easeInEaseOut,
  },
  delete: {
    duration: 200,
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.easeInEaseOut,
  }
}

export function AccordionItem({ children, title, icon }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const animationController = useRef(new Animated.Value(0)).current;

  const toggleListItem = () => {
    const config = {
      duration: 300,
      toValue: isOpen ? 0 : 1,
      useNativeDriver: true,
    }
    Animated.timing(animationController, config).start();
    LayoutAnimation.configureNext(toggleAnimation);
    setIsOpen(!isOpen);
  }

  const arrowTransform = animationController.interpolate({
    inputRange: [0, 1],
    outputRange: ["-90deg", "0deg"],
  });

  return (
    <Host>
      <Header>
      <Pressable onPress={() => toggleListItem()} style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
          <Icon>
            <Image
              source={check}
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
          </Icon>
          <Title>{title}</Title>
        </View>
        <Chevron style={{ transform: [{ rotate: arrowTransform }] }}>
          <Image
            source={chevron}
            style={{ width: 24, height: 24 }}
          />
        </Chevron>
      </Pressable>
      </Header>
        {isOpen &&
          <Content>
            {children}
          </Content>
        }
    </Host>
  )
}
