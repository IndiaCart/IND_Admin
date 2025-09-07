// components/CustomHeader.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { Search, Grid, ChevronDown } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../../design/ThemeContext';
import { CustomColor } from '../../design/Color';

const CustomHeader = ({ onSearch }) => {
  const {userData} = useSelector((state)=> state.user);
    const { theme } = useContext(ThemeContext);
  console.log(userData)
  return (
    <View style={[styles.container , {backgroundColor:theme.background}]}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <View style={{color:theme.text}}>
          <Text style={[styles.greeting ,{color:theme.text}]}>Hello</Text>
          <Text style={[styles.username , {color:theme.text}]}>{userData?.user?.name}!</Text>
          <Text style={[styles.subtitle,{color:CustomColor.GREY_50}]}>Keep manage your sales with care.</Text>
        </View>

        <View style={styles.profileGroup}>
         <Image
            source={{ uri: userData?.user?.profilePic }}
            style={styles.avatar}
          />
        </View>
      </View>

     
    </View>
  );
};

export default CustomHeader;
const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 24,
    
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '500',
  },
  username: {
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    fontFamily:"Inter-semibold",
    marginTop: 4,
  },
  profileGroup: {
    flexDirection:"row",
    gap:10,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 6,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
  },
  // searchContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#f0f0f0',
  //   borderRadius: 12,
  //   paddingHorizontal: 14,
  //   height: 48,
  // },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
});
