<script>
  import { addToStock } from '$lib/form';
  export let data
  let showNames = false

  $: filteredDeductions = data.deductions
  let filteredProducts = data.products

  let filterSku
  let filterName
  let addSku
  let addName

  const filterBySku = async () => {
    filteredDeductions = data.deductions.filter(product => product.sku.toLowerCase().indexOf(filterSku.toLowerCase()) > -1)
  }

  const filterByName = async () => {
    filteredDeductions = data.deductions.filter(product => product.name.toLowerCase().indexOf(filterName.toLowerCase()) > -1)
  }

  const findProduct = async (e) => {
    let name = e.target.value
    filteredProducts = data.products.filter(product => product.name.toLowerCase().indexOf(name.toLowerCase()) > -1)
    showNames = name.length && filteredProducts.length
  }

  const selectProduct = product => {
    showNames = false
    addSku = product.sku
    addName = product.name
  }

  const submitForm = e => {
    const formData = new FormData(e.target);
    const submittedData = {};
    for (let field of formData) {
      const [key, value] = field;
      submittedData[key] = value;
    }
  }

  let formDialogOpen = false

</script>

<svelte:head>
  <title>Add to stock</title>
  <meta name="description" content="Deduct from the stock" />
</svelte:head>

<div class="content">
  <h1>Deduct from the stock</h1>

  <dialog open="{formDialogOpen}" on:close={() => formDialogOpen = false} id="favDialog">
    <form
            class="add-to-stock"
            method="dialog"
            action="/deduct"
            use:addToStock={{
							result: async ({ form }) => {
								form.reset();
							}
						}}
    >
      <h1>Remove from stock</h1>
      <label>
        Product name
        <input autocomplete="off" type="text" id="addName" name="name" bind:value={addName} placeholder="Product name" on:keyup={findProduct} />
        {#if showNames}
          <div class="products-found">
            <ul>
              {#each filteredProducts as pr}
                <li on:click={() => selectProduct(pr)}>
                  {pr.name}
                  <span>sku: {pr.sku}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </label>
      <label>
        SKU
        <input type="text" id="addSku" name="sku" bind:value={addSku} placeholder="Product SKU" />
      </label>
      <label>
        Quantity
        <input type="number" id="qty" name="qty" placeholder="Quantity" />
      </label>
      <label>
        Sell price
        <input type="number" id="sellPrice" name="sellPrice" placeholder="Sell price" />
      </label>
      <div>
        <button value="cancel">Cancel</button>
        <button id="confirmBtn" value="default" type="submit">Deduct</button>
      </div>
    </form>
  </dialog>
  <p>
    <button id="addToStock" on:click={() => formDialogOpen = true}>Deduct stock</button>
  </p>

  <h2>Filter by:</h2>

  <input name="text" autocomplete="off" bind:value="{filterSku}" on:keyup={filterBySku} placeholder="SKU" />
  <input name="text" autocomplete="off" bind:value="{filterName}" on:keyup={filterByName} placeholder="Product name" />

  <table>
    <tr class="table-header">
      <th>SKU</th>
      <th>Name</th>
      <th>Quantity</th>
      <th>Sell price</th>
      <th>Time</th>
    </tr>
    {#each filteredDeductions as product}
      <tr>
        <td>{product.sku}</td>
        <td>{product.name}</td>
        <td>{product.qty}</td>
        <td>{product.sellPrice || ''}</td>
        <td>{product.time}</td>
      </tr>
    {/each}
  </table>
</div>

<style lang="scss">
  dialog {
    min-width: 40vw;
    box-shadow: 0 0 0 100vw rgb(0 0 0 / .7);
  }

  .add-to-stock {
    display: flex;
    flex-direction: column;
  }

  .add-to-stock label {
    display: grid;
    grid-template-columns: 1fr 4fr;
    position: relative;
    text-align: right;
    grid-gap: 10px;
    margin-bottom: 10px;
  }

  .products-found {
    position: absolute;
    left: 0;
    top: 100%;
    right: 0;
    z-index: 10;
    background-color: #fff;
    box-shadow: 2px 2px 4px rgb(0 0 0 / 20%);
  }

  .products-found ul {
    list-style: none;
    text-align: left;
  }

  .products-found ul li {
    cursor: pointer;
    padding: 5px;
  }

  .products-found ul li span {
    margin-left: 30px;
    font-size: 16px;
  }

  .products-found ul li:hover {
    background-color: var(--secondary-color);
  }
</style>
