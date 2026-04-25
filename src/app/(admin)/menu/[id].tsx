import { useProduct } from "@/api/products";
import { defaultpizzaimage } from "@/components/ProductListItem";
import { getImageUrl } from "@/components/RemoteImage";
import Colors from "@/constants/Colors";
import { useCart } from "@/providers/CartProvider";
import { PizzaSize } from "@/types";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
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

  const { addItem } = useCart();
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
      <Stack.Screen
        options={{
          title: "Menu",
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}`} asChild>
              <Pressable
                style={{
                  alignItems: "center",
                  width: 35,
                  aspectRatio: 1,
                  justifyContent: "center",
                }}
              >
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color={Colors.light.tint}
                    style={{
                      opacity: pressed ? 0.5 : 1,
                    }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      <Stack.Screen options={{ title: product?.name }} />
      <Image
        source={
          product.image
            ? { uri: getImageUrl(product.image) }
            : { uri: defaultpizzaimage }
        }
        style={styles.image}
      />

      <Text style={styles.title}>${product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProductDetailsScreen;
