import { useAdminOrderList } from "@/api/orders";
import OrderListItem from "@/components/OrderListItem";
import React from "react";
import { ActivityIndicator, FlatList, Text } from "react-native";

const index = () => {
  const {
    error,
    data: orders,
    isLoading,
  } = useAdminOrderList({ archived: true });
  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Faild to fech</Text>;
  }
  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => <OrderListItem order={item} />}
      contentContainerStyle={{ gap: 10, padding: 10 }}
    />
  );
};

export default index;
