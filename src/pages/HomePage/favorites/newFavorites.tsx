import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectSavedMessages } from '../../../redux/selectors/chatSelectors';
import { toggleMessageSaved } from '../../../redux/chatSlice';
const NewFavorites = () => {
  const dispatch = useDispatch();
  const savedMessages = useSelector(selectSavedMessages);
  const [localMessages, setLocalMessages] = useState([]);

  // 화면 처음 들어왔을 때만 Redux 데이터를 복사
  useEffect(() => {
    setLocalMessages(savedMessages);
  }, []);

  const handleToggle = (id) => {
    dispatch(toggleMessageSaved(id));
    setLocalMessages((prev) =>
      prev.map((msg) => (msg._id === id ? { ...msg, isSaved: !msg.isSaved } : msg)),
    );
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        marginTop: 50,
        padding: 12,
        marginVertical: 6,
        marginHorizontal: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Text style={{ flex: 1 }}>{item.text || '(이미지 메시지)'}</Text>
      <TouchableOpacity onPress={() => handleToggle(item._id)}>
        <Text style={{ fontSize: 18 }}>{item.isSaved ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={localMessages}
      keyExtractor={(item) => item._id.toString()}
      renderItem={renderItem}
      ListEmptyComponent={
        <Text style={{ textAlign: 'center', marginTop: 40 }}>좋아요한 메시지가 없습니다.</Text>
      }
    />
  );
};

export default NewFavorites;
