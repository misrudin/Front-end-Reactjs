import React, { Component, Fragment } from "react";
import "./Product.css";
import { Table, Modal, Button, Form, Col, Row, Alert } from "react-bootstrap";
import { connect } from "react-redux";
import {
  getAllProduct,
  addProduct,
  deleteProduct,
  editProduct,
  sortByCategory
} from "../../redux/actions/product";
import { getAllCategory } from "../../redux/actions/category";
import TableProduct from "./Table";
import swal from "sweetalert";
import { HeaderSearch } from "../Header";

class AddProduct extends Component {
  state = {
    modalShow: false,
    editShow: false,
    product: [],
    keyword: "",
    category: [],
    formProduct: {
      id: "",
      name: "",
      description: "",
      price: "",
      image: null,
      id_category: "",
      stok: ""
    },
    msg: "",
    show: false,
    key: "0"
  };

  handleClose = () => {
    this.setState({
      modalShow: false,
      editShow: false,
      msg: "",
      show: false
    });
  };
  handleCloseAlert = () => {
    this.setState({
      show: false
    });
  };

  getProduct = async () => {
    await this.props.dispatch(getAllProduct());
    const product = this.props.product.productall;
    this.setState({
      product: product
    });
    this.handleClose();
  };

  getCategory = async () => {
    await this.props.dispatch(getAllCategory());
    this.setState({
      category: this.props.category.categoryData
    });
  };

  AddProduct = () => {
    let data = this.state.formProduct;
    if (!/([A-Za-z0-9 ])\w+/g.test(data.name)) {
      this.setState({
        msg: "Name must be filed,minimum 5 char!",
        show: true
      });
    } else if (!/([A-Za-z0-9., ])\w+/g.test(data.description)) {
      this.setState({
        msg: "Complete Description!",
        show: true
      });
    } else if (!data.image) {
      this.setState({
        msg: "Select image!",
        show: true
      });
    } else if (!/([0-9])\w+/g.test(data.stok)) {
      this.setState({
        msg: "Stok must be filed!",
        show: true
      });
    } else if (!/([09])\w+/g.test(data.price)) {
      this.setState({
        msg: "Price must be filed!",
        show: true
      });
    } else if (!data.id_category) {
      this.setState({
        msg: "Select category!",
        show: true
      });
    } else {
      let fd = new FormData();
      fd.append("image", data.image, data.image.name);
      fd.set("name", data.name);
      fd.set("description", data.description);
      fd.set("stok", data.stok);
      fd.set("price", data.price);
      fd.set("id_category", data.id_category);
      this.props.dispatch(addProduct(fd)).then(() => {
        const product = this.props.product.productall;
        this.setState({
          product: product
        });
        this.handleClose();
        swal("Good job!", "Success add product", "success");
      });
    }
  };

  handleChange = e => {
    let newProduct = { ...this.state.formProduct };
    newProduct[e.target.name] = e.target.value;
    this.setState({
      formProduct: newProduct
    });
  };
  handleUpload = ev => {
    let fileName = ev.target.files[0].name;
    let fileSize = ev.target.files[0].size;
    let newProduct = { ...this.state.formProduct };
    newProduct.image = ev.target.files[0];
    if (/.(jpg|gif|png)/g.test(fileName)) {
      if (fileSize > 1048576) {
        this.setState({
          msg: "Image To Large, max 1 Mb!",
          show: true
        });
        newProduct.image = "";
        ev.target.value = null;
      } else {
        this.setState({
          formProduct: newProduct
        });
      }
    } else {
      this.setState({
        msg: "Only image allowed!",
        show: true
      });
      newProduct.image = "";
      ev.target.value = null;
    }
  };

  deleteProductData = id => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this product!",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        this.props.dispatch(deleteProduct(id)).then(() => {
          const product = this.props.product.productData;
          this.setState({
            product: product
          });
          swal("Poof! Product has been deleted!", {
            icon: "success"
          });
        });
      } else {
        const product = this.props.product.productall;
        this.setState({
          product: product
        });
      }
    });
  };

  //edit
  handleShowEdit = product => {
    let newProduct = { ...this.state.formProduct };
    newProduct.id = product.id;
    newProduct.name = product.name;
    newProduct.description = product.description;
    newProduct.image = null;
    newProduct.price = product.price;
    newProduct.stok = product.stok;
    newProduct.id_category = product.id_category;
    this.setState({
      formProduct: newProduct,
      editShow: true
    });
  };

  editProductData = () => {
    const data = this.state.formProduct;
    if (!/([A-Za-z0-9 ])\w+/g.test(data.name)) {
      this.setState({
        msg: "Name must be filed,minimum 5 char!",
        show: true
      });
    } else if (!/([A-Za-z0-9 ])\w+/g.test(data.description)) {
      this.setState({
        msg: "Description must be filed, min 10 char!",
        show: true
      });
    } else if (data.stok === "") {
      this.setState({
        msg: "Stok must be filed!",
        show: true
      });
    } else if (!/([0-9])\w+/g.test(data.price)) {
      this.setState({
        msg: "Price must be filed!",
        show: true
      });
    } else if (!data.id_category) {
      this.setState({
        msg: "Select category!",
        show: true
      });
    } else {
      swal({
        title: "Are you sure?",
        text: "you will edit this product!",
        buttons: ["Cancel", true]
      }).then(willEdit => {
        if (willEdit) {
          let fd = new FormData();
          if (data.image !== null) {
            fd.append("image", data.image, data.image.name);
          }
          fd.set("name", data.name);
          fd.set("description", data.description);
          fd.set("stok", data.stok);
          fd.set("price", data.price);
          fd.set("id_category", data.id_category);
          this.props.dispatch(editProduct(data.id, fd)).then(() => {
            this.setState({
              product: this.props.product.productall
            });
            this.handleClose();
            swal("Poof! Product has been updated!", {
              icon: "success"
            });
          });
        }
      });
    }
  };

  getData = e => {
    this.setState({
      keyword: e
    });
  };

  componentDidMount() {
    this.getCategory();
    this.getProduct();
  }

  sortProduct = key => {
    this.setState({ key: key.target.value }, async () => {
      if (this.state.key.toString() === "0") {
        this.getProduct();
      } else {
        await this.props.dispatch(sortByCategory(this.state.key)).then(() => {
          const product = this.props.product.productall;
          this.setState({
            product: product
          });
        });
      }
    });
  };

  render() {
    let filterProduct = this.state.product.filter(product => {
      return (
        product.name.toLowerCase().indexOf(this.state.keyword.toLowerCase()) !==
        -1
      );
    });
    return (
      <Fragment>
        <HeaderSearch onSearch={e => this.getData(e)} />
        <div className="daftar">
          <div className="headProduct">
            <Button
              className="btn btn-info"
              onClick={() => this.setState({ modalShow: true })}
            >
              Add Product
            </Button>
            <div className="frm">
              <select name="sort" id="sort" onChange={e => this.sortProduct(e)}>
                <option value="0">All Category</option>
                {this.state.category.map(data => {
                  return (
                    <option key={data.id} value={data.id}>
                      {data.nama_category}
                    </option>
                  );
                })}
              </select>
            </div>
            {this.props.product.isPending ? (
              <div className="loadingCat">
                <div className="lds-hourglass"></div>
              </div>
            ) : null}
          </div>
          <Table responsive="m" className="mt-4" striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stok</th>
                <th></th>
              </tr>
            </thead>
            {/* <div className="tbody"> */}
            <tbody>
              {filterProduct.map(product => {
                return (
                  <TableProduct
                    key={product.id}
                    data={product}
                    delete={this.deleteProductData}
                    edit={this.handleShowEdit}
                  />
                );
              })}
            </tbody>
            {/* </div> */}
          </Table>
        </div>
        <Modal
          show={this.state.modalShow}
          onHide={this.handleClose}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add Product
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert
              variant="danger"
              show={this.state.show}
              onClose={this.handleCloseAlert}
              dismissible
            >
              {this.state.msg}
            </Alert>
            <Form>
              <Form.Group as={Row} controlId="formHorizontalName">
                <Form.Label column sm={2}>
                  Name
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    className="txt"
                    name="name"
                    required
                    onChange={this.handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontalDes">
                <Form.Label column sm={2}>
                  Description
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    className="txt"
                    name="description"
                    required
                    onChange={this.handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontalImage">
                <Form.Label column sm={2}>
                  Image
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    className="upload txt"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={this.handleUpload}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontalPrice">
                <Form.Label column sm={2}>
                  Price
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    className="txt"
                    required
                    name="price"
                    onChange={this.handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formHorizontalstok">
                <Form.Label column sm={2}>
                  Stok
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    className="txt"
                    required
                    name="stok"
                    onChange={this.handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontalCategory">
                <Form.Label column sm={2}>
                  Category
                </Form.Label>
                <Col sm={7}>
                  <Form.Control
                    as="select"
                    className="txt"
                    required
                    name="id_category"
                    onChange={this.handleChange}
                  >
                    <option>Chose...</option>
                    {this.state.category.map(data => {
                      return (
                        <option key={data.id} value={data.id}>
                          {data.nama_category}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formHorizontal"></Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.AddProduct}>
              Save
            </Button>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* edit */}
        <Modal
          show={this.state.editShow}
          onHide={this.handleClose}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add Product
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert
              variant="danger"
              show={this.state.show}
              onClose={this.handleCloseAlert}
              dismissible
            >
              {this.state.msg}
            </Alert>
            <Form>
              <Form.Group as={Row} controlId="formHorizontalName">
                <Form.Label column sm={2}>
                  Name
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    value={this.state.formProduct.name}
                    className="txt"
                    name="name"
                    required
                    onChange={this.handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontalDes">
                <Form.Label column sm={2}>
                  Description
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    value={this.state.formProduct.description}
                    className="txt"
                    name="description"
                    required
                    onChange={this.handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontalImage">
                <Form.Label column sm={2}>
                  Image
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    className="upload txt"
                    type="file"
                    fileName={this.state.formProduct.image}
                    name="image"
                    accept="image/*"
                    onChange={this.handleUpload}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontalPrice">
                <Form.Label column sm={2}>
                  Price
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    required
                    value={this.state.formProduct.price}
                    className="txt"
                    name="price"
                    onChange={this.handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formHorizontalstok">
                <Form.Label column sm={2}>
                  Stok
                </Form.Label>
                <Col sm={7}>
                  <Form.Control
                    type="number"
                    required
                    value={this.state.formProduct.stok}
                    className="txt"
                    name="stok"
                    onChange={this.handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formHorizontalCategory">
                <Form.Label column sm={2}>
                  Category
                </Form.Label>
                <Col sm={7}>
                  <Form.Control
                    as="select"
                    required
                    value={this.state.formProduct.id_category}
                    className="txt"
                    name="id_category"
                    onChange={this.handleChange}
                  >
                    <option>Chose...</option>
                    {this.state.category.map(data => {
                      return (
                        <option key={data.id} value={data.id}>
                          {data.nama_category}{" "}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="formHorizontal"></Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              type="submit"
              onClick={this.editProductData}
            >
              {" "}
              Save
            </Button>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ product, category }) => {
  return {
    product,
    category
  };
};

export default connect(mapStateToProps)(AddProduct);
