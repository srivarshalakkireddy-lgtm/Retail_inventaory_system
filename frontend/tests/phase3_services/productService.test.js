import productService from '@src/services/productService';
import api from '@src/services/api';

jest.mock('@src/services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('productService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getProducts should call GET /products with params', async () => {
    const fakeData = { data: [{ id: 1, name: 'Product A' }], pagination: {} };
    api.get.mockResolvedValue({ data: fakeData });

    const result = await productService.getProducts({ page: 1 });

    expect(api.get).toHaveBeenCalledWith('/products', { params: { page: 1 } });
    expect(result).toEqual(fakeData);
  });

  it('getProduct should call GET /products/:id', async () => {
    const fakeData = { data: { id: 1, name: 'Product A' } };
    api.get.mockResolvedValue({ data: fakeData });

    const result = await productService.getProduct(1);

    expect(api.get).toHaveBeenCalledWith('/products/1');
    expect(result).toEqual(fakeData);
  });

  it('createProduct should call POST /products with body', async () => {
    const newProduct = { name: 'New Product', price: 99 };
    const fakeData = { data: { id: 5, ...newProduct } };
    api.post.mockResolvedValue({ data: fakeData });

    const result = await productService.createProduct(newProduct);

    expect(api.post).toHaveBeenCalledWith('/products', newProduct);
    expect(result).toEqual(fakeData);
  });

  it('updateProduct should call PUT /products/:id with body', async () => {
    const fakeData = { data: { id: 1, name: 'Updated' } };
    api.put.mockResolvedValue({ data: fakeData });

    const result = await productService.updateProduct(1, { name: 'Updated' });

    expect(api.put).toHaveBeenCalledWith('/products/1', { name: 'Updated' });
    expect(result).toEqual(fakeData);
  });

  it('deleteProduct should call DELETE /products/:id', async () => {
    api.delete.mockResolvedValue({ data: { success: true } });

    await productService.deleteProduct(1);

    expect(api.delete).toHaveBeenCalledWith('/products/1');
  });
});
