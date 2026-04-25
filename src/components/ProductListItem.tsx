import Colors from "@/constants/Colors";
import { Tables } from "@/types";
import { Link, useSegments } from "expo-router";
import { Image, Pressable, StyleSheet, Text } from "react-native";
import { getImageUrl } from "./RemoteImage";

export const defaultpizzaimage =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png";
type ProductListItemProps = {
  product: Tables<"products">;
};

function ProductList({ product }: ProductListItemProps) {
  const segment = useSegments();

  return (
    <Link href={`${segment[0]}/menu/${product.id}`} asChild>
      <Pressable style={styles.container}>
        <Image
          source={
            product.image
              ? { uri: getImageUrl(product.image) }
              : { uri: defaultpizzaimage }
          }
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </Pressable>
    </Link>
  );
}

export default ProductList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    flex: 1,
    maxWidth: "50%",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },

  price: {
    color: Colors.light.tint,
    fontWeight: "bold",
  },
});
