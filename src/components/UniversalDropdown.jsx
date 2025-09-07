import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { ChevronDown, ChevronUp, Search } from 'lucide-react-native';
import { ThemeContext } from '../design/ThemeContext';
import { CustomColor } from '../design/Color';

const UniversalDropdown = ({
  data = [],
  placeholder = 'Select...',
  onSelect = () => {},
  dropdownWidth = '100%',
  isVisible,
  isRequired,
  setIsVisible,
  disabled = false,
  selectedData = null,
  labelExtractor = (item) => item?.label,
}) => {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { theme } = useContext(ThemeContext);

  // Update selectedItem when selectedData prop changes
  useEffect(() => {
    if (selectedData) {
      setSelectedItem(selectedData);
    } else {
      setSelectedItem(null);
    }
  }, [selectedData]);


  // Reset selected item if the data list changes
  // useEffect(() => {
  //   setSelectedItem(null);
  // }, [data]);

  const filteredData = data.filter((item) =>
    labelExtractor(item).toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item) => {
    if (disabled) return;

    setSelectedItem(item);
    setIsVisible(false);
    setSearch('');
    onSelect(item);
  };
  return (
    <View>
      {isRequired && <Text style={{ color: 'red' }}> *</Text>}

      <View style={[styles.container, { width: dropdownWidth }]}>
        {/* Trigger */}
        <TouchableOpacity
          disabled={disabled}
          style={[
            styles.trigger,
            {
              backgroundColor: disabled ? theme.disabled : theme.inputBackground,
              borderColor: disabled ? theme.disabled : theme.text,
              opacity: disabled ? 0.5 : 1,
            },
          ]}
          onPress={() => !disabled && setIsVisible(!isVisible)}
          activeOpacity={0.8}
        >
          <Text style={[styles.triggerText, { color: theme.text }]}>
            {selectedItem ? labelExtractor(selectedItem) : placeholder}
          </Text>
          {isVisible ? (
            <ChevronUp color={theme.text} size={20} />
          ) : (
            <ChevronDown color={theme.text} size={20} />
          )}
        </TouchableOpacity>

        {/* Dropdown List */}
        {isVisible && !disabled && (
          <View
            style={[
              styles.dropdown,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.text,
              },
            ]}
          >
            {/* Search */}
            <View style={[styles.searchBar, { borderColor: theme.text }]}>
              <Search color={theme.text} size={18} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Search..."
                placeholderTextColor={theme.placeholder}
                value={search}
                onChangeText={setSearch}
                editable={!disabled}
                style={[styles.searchInput, { color: theme.text }]}
              />
              <View
                style={[
                  styles.itemCountBox,
                  {
                    backgroundColor:
                      theme.mode === 'dark'
                        ? CustomColor.GREEN_70
                        : CustomColor.PRUSSIAN_20,
                  },
                ]}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: theme.text }}>
                  {filteredData.length}
                </Text>
              </View>
            </View>

            {/* List */}
            <Animated.FlatList
              data={filteredData}
              keyExtractor={(item, idx) => idx.toString()}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
              style={styles.list}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.itemBox, { borderColor: theme.placeholder }]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[styles.itemText, { color: theme.text }]}>
                    {labelExtractor(item)}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderWidth: 1.5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  triggerText: {
    fontSize: 16,
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    maxHeight: 400,
    borderWidth: 1.2,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    zIndex: 999,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 4,
  },
  itemBox: {
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
  },
  itemText: {
    fontSize: 15,
  },
  itemCountBox: {
    minWidth: 40,
    minHeight: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});

export default UniversalDropdown;
