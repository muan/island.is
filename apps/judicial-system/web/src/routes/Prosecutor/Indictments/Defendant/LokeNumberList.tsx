import React from 'react'

import { Box, Button, Checkbox } from '@island.is/island-ui/core'

interface Props {
  index?: number
}
interface CheckBoxContainerProps {
  children: React.ReactNode
}

const CheckBoxContainer: React.FC<CheckBoxContainerProps> = (props) => {
  return (
    <Box
      paddingX={3}
      paddingY={2}
      borderRadius="standard"
      background="blue100"
      marginBottom={2}
    >
      {props.children}
    </Box>
  )
}

export const LokeNumberList: React.FC<Props> = (props) => {
  const { index } = props

  return (
    <>
      <Box
        marginBottom={3}
        borderColor="blue200"
        borderWidth="standard"
        paddingX={4}
        paddingY={1}
        borderRadius="standard"
      >
        <Box paddingX={3} paddingY={2}>
          <Checkbox label="Velja öll" name="Velja öll" />
        </Box>

        <CheckBoxContainer>
          <Checkbox
            label="antoherLabel"
            name="antoherLabel"
            backgroundColor="blue"
          />
        </CheckBoxContainer>
      </Box>
      <Box
        display="flex"
        justifyContent="flexEnd"
        marginTop={3}
        marginBottom={5}
      >
        <Button
          onClick={() => {
            // TODO
          }}
        >
          Velja númer
        </Button>
      </Box>
    </>
  )
}
