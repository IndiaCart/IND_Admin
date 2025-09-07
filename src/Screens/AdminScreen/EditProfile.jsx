import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../components/BackButton';

const EditProfile = () => {
    const navigation = useNavigation();
  return (
    <View>
       <BackButton margin={16} size={28} color="#333" />
      <Text>EditProfile</Text>
    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({})