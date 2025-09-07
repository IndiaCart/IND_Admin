import React, { useContext } from 'react';
import { HOSTED_URL } from '@env'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import NavigationBox from './NavigationBox';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { ThemeContext } from '../../../design/ThemeContext';
import {
  Package,
  Layers,
  ClipboardList,
  ChartBar,
  History,
  Bell,
} from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllCategoryUrl, getAllProductUrl, GetAllSubCategoryUrl, GetAllVariationUrl } from '../../../utils/apis/adminAPI';
import axios from 'axios';
import { getAllProduct } from '../../../Redux/action/adminManage/productManage';

const systemSans = Platform.select({
  ios: 'Helvetica',
  android: 'sans-serif',
});
console.log("HOSTED_URL", HOSTED_URL)
const Manage = () => {
     const { fetchedCategories, fetchedSubCategory, fetchedVariation, loading } =
        useSelector((state) => state.manage);
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  // Icon mapping
  const stats = {
    products: { Icon: <Package size={28} color="#fff" /> },
    categories: { Icon: <Layers size={28} color="#fff" /> },
    orders: { Icon: <ClipboardList size={28} color="#fff" /> },
    analytics: { Icon: <ChartBar size={28} color="#fff" /> },
    history: { Icon: <History size={28} color="#fff" /> },
    notifications: { Icon: <Bell size={28} color="#fff" /> },
  };

  // Get all category from backend
  const getAllCategory = async () => {
    try {
      dispatch({ type: "START_MANAGE_LOADING" });

      const response = await axios.get(`${HOSTED_URL}${GetAllCategoryUrl}`);

      if (response.data.success) {
        dispatch({
          type: "FETCH_CATEGORY_SUCCESS",
          payload: response.data.data, // Adjust based on API structure
        });
      } else {
        dispatch({
          type: "FETCH_CATEGORY_FAILURE",
          payload: response.data.message || "Failed to fetch categories",
        });
        console.warn("Category fetch failed:", response.data.message);
      }

    } catch (error) {
      dispatch({
        type: "FETCH_FAILURE",
        payload: error.message || "Something went wrong while fetching categories",
      });
      console.error("Error fetching categories:", error);
    }
  };
  // Get all sub category from backend
  const getAllSubCategory = async () => {
    try {
      dispatch({ type: "START_MANAGE_LOADING" });

      const response = await axios.get(`${HOSTED_URL}${GetAllSubCategoryUrl}`);

      if (response.data.success) {
        dispatch({
          type: "FETCH_SUB_CATEGORY_SUCCESS",
          payload: response.data.data,
        });
      } else {
        dispatch({
          type: "FETCH_FAILURE",
          payload: response.data.message || "Failed to fetch categories",
        });
        console.warn("Category fetch failed:", response.data.message);
      }

    } catch (error) {
      dispatch({
        type: "FETCH_FAILURE",
        payload: error.message || "Something went wrong while fetching categories",
      });
      console.error("Error fetching categories:", error);
    }
  };
  const getAllVariation = async () => {
    try {
      dispatch({ type: "START_MANAGE_LOADING" });

      const response = await axios.get(`${HOSTED_URL}${GetAllVariationUrl}`);

      if (response.data.success) {
        dispatch({
          type: "FETCH_ALL_VARIATION_SUCCESS",
          payload: response.data.data,
        });
      } else {
        dispatch({
          type: "FETCH_FAILURE",
          payload: response.data.message || "Failed to fetch categories",
        });
        console.warn("Category fetch failed:", response.data.message);
      }

    } catch (error) {
      dispatch({
        type: "FETCH_FAILURE",
        payload: error.message || "Something went wrong while fetching categories",
      });
      console.error("Error fetching categories:", error);
    }
  };
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.heading, { color: theme.text }]}>Manage</Text>

      <View style={styles.row}>
        <NavigationBox
          onClick={[getAllCategory, getAllSubCategory, getAllVariation]}
          title="Products"
          dispatchFun={() => dispatch(getAllProduct())}
          Icon={stats.products.Icon}
          navigateTo="productAction"
          gradientColors={['#00467F', '#a5cc82']}
          borderColor="#00467F"
          width={wp('44%')}
          height={hp('20%')}
        />
        <NavigationBox
          title="Categories"
          onClick={[getAllCategory , getAllSubCategory , getAllVariation]}
          navigateTo="categoryAction"
          Icon={stats.categories.Icon}
          gradientColors={['#ee9ca7', '#1565C0']}
          borderColor="#1565C0"
          width={wp('44%')}
          height={hp('20%')}
        />
      </View>

      <View style={styles.row}>
        <NavigationBox
          title="Orders"
          Icon={stats.orders.Icon}
          gradientColors={['#1D2671', '#b20a2c']}
          borderColor="#c31432"
          width={wp('44%')}
          height={hp('20%')}
        />
        <NavigationBox
          title="Notifications"
          Icon={stats.notifications.Icon}
          gradientColors={['#a8c0ff', '#3f2b96']}
          borderColor="#3f2b96"
          width={wp('44%')}
          height={hp('20%')}
        />
      </View>

      <View style={styles.row}>
        <NavigationBox
          title="Analytics"
          Icon={stats.analytics.Icon}
          gradientColors={['#f12711', '#f5af19']}
          borderColor="#f12711"
          width={wp('44%')}
          height={hp('20%')}
        />
        <NavigationBox
          title="History"
          Icon={stats.history.Icon}
          gradientColors={['#00B4DB', '#0083B0']}
          borderColor="#0083B0"
          width={wp('44%')}
          height={hp('20%')}
        />
      </View>


      {/* Add more rows as needed */}
    </ScrollView>
  );
};

export default Manage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2.5%'),
    paddingBottom: hp('4%'),
  },
  heading: {
    fontSize: wp('6%'),
    fontWeight: '700',
    marginBottom: hp('2%'),
    fontFamily: systemSans,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2.5%'),
  },
});
