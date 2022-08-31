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
  let addQty
  let addPrice
  let submitDisabled
  $: submitDisabled = !addSku || !addName || !addQty || !addPrice

  const filterBySku = async () => {
    filteredDeductions = filterSku ? data.deductions.filter(product => product.sku.toLowerCase().indexOf(filterSku.toLowerCase()) > -1) : data.deductions
  }

  const filterByName = async () => {
    filteredDeductions = filterName ? data.deductions.filter(product => product.name.toLowerCase().indexOf(filterName.toLowerCase()) > -1) : data.deductions
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

  const closeDialog = e => {
    if (e.key === 'Escape') {
      formDialogOpen = false
      document.querySelector('form').reset();
    }
  }
</script>

<svelte:head>
  <title>Deduct from stock</title>
  <meta name="description" content="Deduct from the stock" />
</svelte:head>
<svelte:window on:keydown={closeDialog} />

<div class="content">
  <h1>Deduct from the stock</h1>

  <dialog open="{formDialogOpen}" on:close={() => formDialogOpen = false} id="favDialog">
    <form
            class="deduct-from-stock"
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
        <input type="number" id="qty" name="qty" bind:value={addQty} placeholder="Quantity" />
      </label>
      <label>
        Sell price
        <input type="number" id="sellPrice" name="sellPrice" bind:value={addPrice} placeholder="Sell price" />
      </label>
      <div>
        <button value="cancel" type="reset" on:click={() => formDialogOpen = false}>Cancel</button>
        <button id="confirmBtn" value="default" type="submit" disabled={submitDisabled}>Deduct</button>
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
      <th>Actions</th>
    </tr>
    {#each filteredDeductions as product}
      <tr>
        <td>{product.sku}</td>
        <td>{product.name}</td>
        <td>{product.qty}</td>
        <td>{product.sellPrice || ''}</td>
        <td>{product.time}</td>
        <td class="record-actions">
          <form
            action="/deduct?_method=DELETE"
            method="post"
            use:addToStock={{
							pending: () => {
								product.pending_delete = true
								setTimeout(()=>{ product.pending_delete = false }, 3000)
							}
						}}
          >
            <input type="hidden" name="id" value={product.id} />
            <button class="icon-button" aria-label="Delete addition" disabled={product.pending_delete} >
              <svg width="30" height="35" viewBox="0 0 30 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.05357 1.20019C9.41518 0.464605 10.1585 0 10.9687 0H19.0313C19.8415 0 20.5848 0.464605 20.9464 1.20019L21.4286 2.17105H27.8571C29.0424 2.17105 30 3.14328 30 4.34211C30 5.54093 29.0424 6.51316 27.8571 6.51316H2.14286C0.959598 6.51316 0 5.54093 0 4.34211C0 3.14328 0.959598 2.17105 2.14286 2.17105H8.57143L9.05357 1.20019ZM2.08259 8.68421H27.8571V30.3947C27.8571 32.7897 25.9353 34.7368 23.5714 34.7368H6.3683C4.06138 34.7368 2.08259 32.7897 2.08259 30.3947V8.68421ZM7.43973 14.1118V29.3092C7.43973 29.9063 7.98214 30.3947 8.51116 30.3947C9.16071 30.3947 9.58259 29.9063 9.58259 29.3092V14.1118C9.58259 13.5148 9.16071 13.0263 8.51116 13.0263C7.98214 13.0263 7.43973 13.5148 7.43973 14.1118ZM13.8683 14.1118V29.3092C13.8683 29.9063 14.4107 30.3947 14.9397 30.3947C15.5893 30.3947 16.0714 29.9063 16.0714 29.3092V14.1118C16.0714 13.5148 15.5893 13.0263 14.9397 13.0263C14.4107 13.0263 13.8683 13.5148 13.8683 14.1118ZM20.3571 14.1118V29.3092C20.3571 29.9063 20.8393 30.3947 21.4286 30.3947C22.0179 30.3947 22.5 29.9063 22.5 29.3092V14.1118C22.5 13.5148 22.0179 13.0263 21.4286 13.0263C20.8393 13.0263 20.3571 13.5148 20.3571 14.1118Z" fill="black"/>
              </svg>
            </button>
          </form>
        </td>
      </tr>
    {/each}
  </table>
</div>

<style lang="scss">
  dialog {
    min-width: 40vw;
    box-shadow: 0 0 0 100vw rgb(0 0 0 / .7);
  }

  .deduct-from-stock {
    display: flex;
    flex-direction: column;
  }

  .deduct-from-stock label {
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
