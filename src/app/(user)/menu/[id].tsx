import { useProduct } from "@/api/products";
import Button from "@/components/Button";
import { defaultpizzaimage } from "@/components/ProductListItem";
import { getImageUrl } from "@/components/RemoteImage";
import { useCart } from "@/providers/CartProvider";
import { PizzaSize } from "@/types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
const ProductDetailsScreen = () => {
  const { id: idstring } = useLocalSearchParams(); //string

  const id = parseFloat(typeof idstring === "string" ? idstring : idstring[0]);
  const { data: product, error, isLoading } = useProduct(id);

  const { addItem, items } = useCart();
  const router = useRouter();
  const [selectsize, setselectsize] = useState<PizzaSize>("S");
  const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

  const addtocart = () => {
    if (!product) return;
    addItem(product, selectsize);
    router.push("/cart");
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error) {
    return <Text>Faild to fetch products </Text>;
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product?.name }} />
      <Image
        source={
          product.image
            ? { uri: getImageUrl(product.image) }
            : { uri: defaultpizzaimage }
        }
        style={styles.image}
      />
      <Text>Select size</Text>
      <View style={styles.sizes}>
        {sizes.map((size) => (
          <Pressable
            onPress={() => setselectsize(size)}
            key={size}
            style={[
              styles.size,
              { backgroundColor: selectsize === size ? "gainsboro" : "white" },
            ]}
          >
            <Text
              style={[
                styles.sizetext,
                { color: selectsize === size ? "black" : "gray" },
              ]}
            >
              {size}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.price}>${product.price}</Text>
      <Button onPress={addtocart} text="Add to cart" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: "auto",
  },
  sizes: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  size: {
    backgroundColor: "gainsboro",
    width: 50,
    borderRadius: 25,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sizetext: {
    fontSize: 20,
    fontWeight: "500",
  },
});

export default ProductDetailsScreen;
