import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Image from "next/image";
import Header from "@/components/Header";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Table from "@/components/Table";
import Input from "@/components/Input";
import empty from "../Assets/empty.png";
import sent from "../Assets/sent.png";
import Title from "@/components/Title";

const ColumnWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-top: 40px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr 0.8fr;
  }
`;

const Box = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 30px;
`;
const ProductInfoCell = styled.td`
  padding: 10px 0;
`;
const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 60px;
    max-height: 60px;
  }

  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img {
      max-width: 80px;
      max-height: 80px;
    }
  }
`;
const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: block;
    padding: 0 10px;
  }
`;
const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;
const EmptyDiv = styled.div`
  width: 100%;

  display: grid;
  justify-items: center;
  gap: 50px;
  text-align: center;
  font-size: 1.2rem;
`;

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct, clearCart } =
    useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [country, setCountry] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios
        .post("/api/cart", { ids: cartProducts })

        .then((response) => {
          setProducts(response.data);
        });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (window.location.href.includes("success")) {
      setIsSuccess(true);
      clearCart();
    }
  }, []);

  function moreOfThisProduct(id) {
    addProduct(id);
  }
  function lessOfThisProduct(id) {
    removeProduct(id);
  }
  async function goToPayment() {
    const response = await axios.post("/api/checkout", {
      name,
      email,
      city,
      postalCode,
      streetAddress,
      country,
      // products:
      cartProducts,
    });
    if (response.data.url) {
      window.location = response.data.url;
    }
  }
  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    total += price;
  }

  if (isSuccess) {
    return (
      <>
        <Center>
          <ColumnWrapper>
            <Box>
              <h1>Thank you for your order</h1>
              <p>We will email you when your order is sent</p>
              <Image width={100} src={sent} alt="ft1" />
            </Box>
          </ColumnWrapper>
        </Center>
      </>
    );
  }
  return (
    <>
      <Center>
        <ColumnWrapper>
          <Box>
            <Title>Panier</Title>
            {!cartProducts?.length && (
              <EmptyDiv>
                <h1>Your cart is empty</h1>
                <Image width={200} src={empty} alt="ft1" />
              </EmptyDiv>
            )}
            {products?.length > 0 && (
              <Table>
                <thead>
                  <th>Produit</th>
                  <th>Quantité</th>
                  <th>Prix</th>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.images[0]} alt="" />
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>
                      <td>
                        <Button onClick={() => lessOfThisProduct(product._id)}>
                          -
                        </Button>
                        <QuantityLabel>
                          {
                            cartProducts.filter((id) => id === product._id)
                              .length
                          }
                        </QuantityLabel>
                        <Button onClick={() => moreOfThisProduct(product._id)}>
                          +
                        </Button>
                      </td>
                      <td>
                        {cartProducts.filter((id) => id === product._id)
                          .length * product.price}
                        $
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td>{total}$</td>
                  </tr>
                </tbody>
              </Table>
            )}
          </Box>
          {!!cartProducts?.length && (
            <Box>
              <h2>Informations sur la commande</h2>

              <Input
                type="text"
                placeholder="Nom"
                value={name}
                name="name"
                onChange={(ev) => setName(ev.target.value)}
              ></Input>
              <Input
                type="text"
                placeholder="Email"
                value={email}
                name="email"
                onChange={(ev) => setEmail(ev.target.value)}
              ></Input>
              <CityHolder>
                <Input
                  type="text"
                  placeholder="Ville"
                  value={city}
                  name="city"
                  onChange={(ev) => setCity(ev.target.value)}
                ></Input>
                <Input
                  type="text"
                  placeholder="Code Postale"
                  value={postalCode}
                  name="postalCode"
                  onChange={(ev) => setPostalCode(ev.target.value)}
                ></Input>
              </CityHolder>

              <Input
                type="text"
                placeholder="Address"
                value={streetAddress}
                name="streetAddress"
                onChange={(ev) => setStreetAddress(ev.target.value)}
              ></Input>
              <Input
                type="text"
                placeholder="Cité"
                value={country}
                name="country"
                onChange={(ev) => setCountry(ev.target.value)}
              ></Input>
              {/* <input
                type="hidden"
                name="products"
                value={cartProducts.join(",")}
              /> */}
              <Button black="true" block onClick={goToPayment}>
                Payer
              </Button>
            </Box>
          )}
        </ColumnWrapper>
      </Center>
    </>
  );
}
