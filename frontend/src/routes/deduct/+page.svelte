<script>
  import { addToStock } from '$lib/form';
  import {formatDate} from "../../lib/functions";
  export let data
  let showNames = false

  $: filteredDeductions = data.deductions
  let filteredProducts = data.products

  let filterSku
  let filterName
  let addSku
  let addName
  let nameInput
  let addQty
  let addPrice
  let submitDisabled
  $: submitDisabled = !addSku || !addName || !addQty || !addPrice
  let currentFocus

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
    if (showNames) {
      let autoSuggest = document.querySelectorAll('.products-autocomplete ul li')
      if (e.key === 'ArrowDown') {
        currentFocus++
        setActive(autoSuggest)
      } else if (e.key === 'ArrowUp') {
        currentFocus--
        setActive(autoSuggest)
      } else if (currentFocus > -1 && e.key === 'Enter') {
        selectProduct(filteredProducts[currentFocus])
      } else {
        currentFocus = -1
      }
    }
  }

  const setActive = x => {
    if (!x) return false
    removeActive(x)
    if (currentFocus >= x.length) currentFocus = 0
    if (currentFocus < 0) currentFocus = (x.length - 1)
    x[currentFocus].classList.add("in-focus")
    x[currentFocus].focus()
  }

  const removeActive = x => {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("in-focus")
    }
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


  const openDialog = e => {
    formDialogOpen = true
    setTimeout(() => {
      nameInput.focus()
    }, 100)
  }

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
        <input bind:this={nameInput} autocomplete="off" type="text" id="addName" name="name" bind:value={addName} placeholder="Product name" on:keyup={findProduct}  on:blur={() => showNames = false} />
        {#if showNames}
          <div class="products-autocomplete">
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
    <button id="addToStock" on:click={openDialog}>Deduct stock</button>
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
        <td>{formatDate(product.time)}</td>
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
              <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.13036 0.677727C5.33527 0.262356 5.75647 0 6.21563 0H10.7844C11.2435 0 11.6647 0.262356 11.8696 0.677727L12.1429 1.22596H15.7857C16.4574 1.22596 17 1.77496 17 2.45192C17 3.12888 16.4574 3.67788 15.7857 3.67788H1.21429C0.543772 3.67788 0 3.12888 0 2.45192C0 1.77496 0.543772 1.22596 1.21429 1.22596H4.85714L5.13036 0.677727ZM1.18013 4.90385H15.7857V17.1635C15.7857 18.5159 14.6967 19.6154 13.3571 19.6154H3.60871C2.30145 19.6154 1.18013 18.5159 1.18013 17.1635V4.90385ZM4.21585 7.96875V16.5505C4.21585 16.8876 4.52321 17.1635 4.82299 17.1635C5.19107 17.1635 5.43013 16.8876 5.43013 16.5505V7.96875C5.43013 7.63161 5.19107 7.35577 4.82299 7.35577C4.52321 7.35577 4.21585 7.63161 4.21585 7.96875ZM7.85871 7.96875V16.5505C7.85871 16.8876 8.16607 17.1635 8.46585 17.1635C8.83393 17.1635 9.10714 16.8876 9.10714 16.5505V7.96875C9.10714 7.63161 8.83393 7.35577 8.46585 7.35577C8.16607 7.35577 7.85871 7.63161 7.85871 7.96875ZM11.5357 7.96875V16.5505C11.5357 16.8876 11.8089 17.1635 12.1429 17.1635C12.4768 17.1635 12.75 16.8876 12.75 16.5505V7.96875C12.75 7.63161 12.4768 7.35577 12.1429 7.35577C11.8089 7.35577 11.5357 7.63161 11.5357 7.96875Z" fill="black"/>
              </svg>
            </button>
          </form>
        </td>
      </tr>
    {/each}
  </table>
</div>

<style lang="scss">
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
</style>
