import { useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';

export type CartDetail = { label: string; value: string };
export type CartItem = {
  id: string;
  name: string;
  icon: string;
  price: number;
  quantity: number;
  details: CartDetail[];
};

type FlavorGroup = { title: string; tone: string; items: string[] };
type GelatoSize = { id: string; name: string; label: string; normalPrice: number; steviaPrice: number };
type ChurrosSize = { id: string; label: string; price: number };

type BaseSpecialConfig = { productId: string; productName: string; price: number; icon: string };
export type ModalConfig =
  | { kind: 'gelato'; sizeId: string }
  | { kind: 'churros'; sizeId: string }
  | { kind: 'minichurros' }
  | { kind: 'filledChurro'; productId: string; productName: string; price: number }
  | { kind: 'cafe'; productId: string; productName: string; basePrice: number }
  | { kind: 'milkshake' | 'icedCoffee' | 'singleFlavor' | 'beverage'; product: BaseSpecialConfig }
  | { kind: 'hotChocolate'; product: BaseSpecialConfig };

const sugarOptions = ['Azúcar flor', 'Azúcar canela'];
const sauceOptions = ['Manjar', 'Chocolate', 'Caramelo', 'Frambuesa', 'Frutilla'];
const addOnOptions = ['Ositos de Gomitas', 'Marshmallow', 'Maní', 'Coco', 'Lluvia de Colores', 'Lluvia de Chocolate'];
const milkOptions = ['Leche entera', 'Leche sin lactosa'];
const sweetenerOptions = ['Con azúcar', 'Con endulzante', 'Sin nada'];
const sprinkleOptions = ['Sin chispas', 'Chispas de colores', 'Chispas de chocolate'];
const beverageOptions = ['Coca-Cola', 'Sprite', 'Fanta'];

const modalTitles: Record<ModalConfig['kind'], string> = {
  gelato: 'Personaliza tu helado 🍦', churros: 'Personaliza tus churros 🍩', minichurros: 'Personaliza tus mini churros 🍩', filledChurro: '¿Cómo deseas tus churros? 🍩', cafe: 'Personaliza tu café ☕', milkshake: 'Personaliza tu milkshake 🥤', icedCoffee: 'Personaliza tu café helado ☕', singleFlavor: 'Personaliza tu postre 🍨', beverage: 'Elige tu bebida 🥤', hotChocolate: 'Personaliza tu chocolate caliente ☕',
};

const denominationOf = (groupTitle: string) => {
  if (groupTitle.includes('crema')) return 'Crema';
  if (groupTitle.includes('Stevia')) return 'Stevia';
  if (groupTitle.includes('agua')) return 'Agua';
  if (groupTitle.includes('premium')) return 'Premium';
  return groupTitle.replace('Helados ', '');
};
const flavorLabel = (flavor: string, denomination: string) => `${flavor} ${denomination}`;

export function ProductModal({ config, flavorGroups, gelatoSizes, churrosSizes, image, onClose, onAdd }: {
  config: ModalConfig;
  flavorGroups: FlavorGroup[];
  gelatoSizes: GelatoSize[];
  churrosSizes: ChurrosSize[];
  image: string;
  onClose: () => void;
  onAdd: (item: CartItem) => void;
}) {
  const { kind } = config;
  const [sizeId, setSizeId] = useState(kind === 'gelato' || kind === 'churros' ? config.sizeId : '');
  const [flavor, setFlavor] = useState('');
  const [secondFlavor, setSecondFlavor] = useState('');
  const [thirdFlavor, setThirdFlavor] = useState('');
  const [addOns, setAddOns] = useState<string[]>([]);
  const [sugar, setSugar] = useState('');
  const [sauce1, setSauce1] = useState('');
  const [sauce2, setSauce2] = useState('');
  const [singleSauce, setSingleSauce] = useState('');
  const [hazelnutSauce, setHazelnutSauce] = useState(false);
  const [coffeeSize, setCoffeeSize] = useState<'8 oz' | '12 oz'>('8 oz');
  const [milk, setMilk] = useState('');
  const [sweetener, setSweetener] = useState('');
  const [sprinkles, setSprinkles] = useState('');
  const [beverage, setBeverage] = useState('');
  const [cacao, setCacao] = useState('Cacao dulce');
  const [quantity, setQuantity] = useState(1);

  const isSpecial = kind === 'milkshake' || kind === 'icedCoffee';
  const specialProduct = isSpecial || kind === 'singleFlavor' || kind === 'beverage' || kind === 'hotChocolate' ? config.product : null;
  const currentSize = gelatoSizes.find((s) => s.id === sizeId);
  const basePrice = kind === 'gelato' ? (currentSize?.normalPrice ?? 0) : kind === 'churros' ? (churrosSizes.find((s) => s.id === sizeId)?.price ?? 0) : kind === 'minichurros' ? 4500 : kind === 'filledChurro' ? config.price : kind === 'cafe' ? config.basePrice + (coffeeSize === '12 oz' ? 500 : 0) : kind === 'hotChocolate' ? config.product.price : specialProduct?.price ?? 0;
  const selectedGelatoFlavors = kind === 'gelato' ? [flavor, secondFlavor, thirdFlavor].filter(Boolean) : [];
  const gelatoIsStevia = selectedGelatoFlavors.some((f) => f.endsWith(' Stevia'));
  const gelatoPrice = kind === 'gelato' && currentSize ? (gelatoIsStevia ? currentSize.steviaPrice : currentSize.normalPrice) : basePrice;
  const additionsTotal = kind === 'gelato' ? addOns.length * 300 : 0;
  const extraHazelnut = (kind === 'churros' || kind === 'minichurros') && hazelnutSauce ? 500 : kind === 'singleFlavor' && hazelnutSauce ? 500 : 0;
  const currentPrice = (kind === 'gelato' ? gelatoPrice + additionsTotal : basePrice + extraHazelnut);

  const gelatoScoopCount = sizeId === 'doble' ? 2 : sizeId === 'triple' ? 3 : 1;
  const gelatoIsScoopSize = sizeId === 'simple' || sizeId === 'doble' || sizeId === 'triple';
  const gelatoIsTubSize = sizeId === 'medio-litro' || sizeId === 'litro';
  const canAdd = kind === 'gelato' ? (gelatoIsScoopSize
    ? (gelatoScoopCount === 1 ? Boolean(flavor)
      : gelatoScoopCount === 2 ? Boolean(flavor && secondFlavor)
      : Boolean(flavor && secondFlavor && thirdFlavor))
    : Boolean(flavor))
    : kind === 'churros' ? Boolean(sugar && sauce1 && sauce2)
    : kind === 'minichurros' ? Boolean(sugar && singleSauce)
    : kind === 'filledChurro' ? Boolean(sugar)
    : kind === 'cafe' ? Boolean(coffeeSize && sweetener && (['Café americano', 'Café en grano', 'Té'].includes(config.productName) || milk))
    : kind === 'milkshake' || kind === 'icedCoffee' ? Boolean(flavor && secondFlavor && milk && sprinkles)
    : kind === 'singleFlavor' ? Boolean(flavor && singleSauce)
    : kind === 'beverage' ? Boolean(beverage)
    : Boolean(cacao);

  const errorMessage = canAdd ? '' : kind === 'gelato' ? (gelatoIsScoopSize ? (gelatoScoopCount === 1 ? 'Por favor selecciona un sabor.' : gelatoScoopCount === 2 ? 'Por favor selecciona los 2 sabores.' : 'Por favor selecciona los 3 sabores.') : 'Por favor selecciona un sabor.') : kind === 'churros' ? 'Completa el azúcar y las 2 salsas.' : kind === 'minichurros' ? 'Completa el azúcar y la salsa.' : kind === 'filledChurro' ? 'Por favor selecciona un tipo de azúcar.' : kind === 'cafe' ? (['Café americano', 'Café en grano', 'Té'].includes(config.productName) ? 'Completa el tamaño y endulzante.' : 'Completa el tamaño, endulzante y tipo de leche.') : kind === 'milkshake' || kind === 'icedCoffee' ? 'Selecciona 2 sabores, leche y chispas.' : kind === 'singleFlavor' ? 'Selecciona un sabor y una salsa.' : kind === 'beverage' ? 'Selecciona una bebida.' : '';

  const toggleAddOn = (addOn: string) => setAddOns((prev) => prev.includes(addOn) ? prev.filter((x) => x !== addOn) : [...prev, addOn]);
  const chooseFlavor = (value: string, slot: 'first' | 'second') => slot === 'first' ? setFlavor(value) : setSecondFlavor(value);
  const renderFlavorPicker = (label: string, value: string, slot: 'first' | 'second', allowEmpty = false) => (
    <div className="modal-section">
      <div className="modal-section-title">{label}</div>
      {flavorGroups.map((group) => <div className="modal-flavor-group" key={`${slot}-${group.title}`}><div className="modal-flavor-group-title">{group.title}</div><div className="modal-flavors">{group.items.map((f) => { const option = flavorLabel(f, denominationOf(group.title)); return <button key={option} className={`modal-flavor ${value === option ? 'active' : ''}`} onClick={() => chooseFlavor(option, slot)}>{f} <small>{denominationOf(group.title)}</small></button>; })}</div></div>)}
      {allowEmpty && <button className="modal-cancel" onClick={() => slot === 'first' ? setFlavor('') : setSecondFlavor('')}>Limpiar selección</button>}
    </div>
  );
  const renderScoopSelect = (label: string, value: string, setter: (v: string) => void) => (
    <div className="modal-section">
      <div className="modal-section-title">{label}</div>
      <select className="modal-select" value={value} onChange={(e) => setter(e.target.value)}>
        <option value="">Seleccionar sabor</option>
        {flavorGroups.map((group) => <optgroup key={group.title} label={group.title}>{group.items.map((f) => { const opt = flavorLabel(f, denominationOf(group.title)); return <option key={opt} value={opt}>{opt}</option>; })}</optgroup>)}
      </select>
    </div>
  );

  const handleAdd = () => {
    if (!canAdd) return;
    let item: CartItem;
    if (kind === 'gelato') {
      const size = currentSize!;
      const addOnDetails = addOns.map((a) => `${a} (+$300)`).join(' + ');
      const flavorDetails: CartDetail[] = gelatoIsScoopSize
        ? [flavor, secondFlavor, thirdFlavor].filter(Boolean).map((s, i) => ({ label: `Bola ${i + 1}`, value: s }))
        : gelatoIsTubSize
          ? [flavor, secondFlavor, thirdFlavor].filter(Boolean).map((s, i) => ({ label: `Sabor ${i + 1}`, value: s }))
          : [{ label: 'Sabor', value: flavor }];
      item = { id: `gelato-${sizeId}-${flavor}-${secondFlavor}-${thirdFlavor}-${[...addOns].sort().join('+')}`, name: size.name, icon: '🍦', price: currentPrice, quantity, details: [...flavorDetails, ...(addOns.length ? [{ label: 'Adiciones', value: addOnDetails }] : [])] };
    } else if (kind === 'churros') {
      const size = churrosSizes.find((s) => s.id === sizeId)!;
      item = { id: `churros-${sizeId}-${sugar}-${sauce1}-${sauce2}-${hazelnutSauce}`, name: 'Churros españoles', icon: '🍩', price: currentPrice, quantity, details: [{ label: 'Presentación', value: size.label }, { label: 'Azúcar', value: sugar }, { label: 'Salsas', value: `${sauce1} + ${sauce2}` }, ...(hazelnutSauce ? [{ label: 'Adición', value: 'Salsa de chocolate de avellana (+$500)' }] : [])] };
    } else if (kind === 'minichurros') {
      item = { id: `minichurros-${sugar}-${singleSauce}-${hazelnutSauce}`, name: 'Mini churros en vasos', icon: '🍩', price: currentPrice, quantity, details: [{ label: 'Azúcar', value: sugar }, { label: 'Salsa', value: singleSauce }, ...(hazelnutSauce ? [{ label: 'Adición', value: 'Salsa de chocolate de avellana (+$500)' }] : [])] };
    } else if (kind === 'filledChurro') {
      item = { id: `filled-${config.productId}-${sugar}`, name: config.productName, icon: '🍩', price: config.price, quantity, details: [{ label: 'Azúcar', value: sugar }] };
    } else if (kind === 'cafe') {
      const details = [{ label: 'Tamaño', value: coffeeSize }, ...(milk ? [{ label: 'Leche', value: milk }] : []), { label: 'Endulzante', value: sweetener }];
      item = { id: `cafe-${config.productId}-${coffeeSize}-${milk}-${sweetener}`, name: config.productName, icon: '☕', price: currentPrice, quantity, details };
    } else if (kind === 'milkshake' || kind === 'icedCoffee') {
      item = { id: `${kind}-${specialProduct!.productId}-${flavor}-${secondFlavor}-${milk}-${sprinkles}`, name: specialProduct!.productName, icon: specialProduct!.icon, price: specialProduct!.price, quantity, details: [{ label: 'Sabores', value: `${flavor} + ${secondFlavor}` }, { label: 'Leche', value: milk }, { label: 'Chispas', value: sprinkles }] };
    } else if (kind === 'singleFlavor') {
      item = { id: `${specialProduct!.productId}-${flavor}-${singleSauce}-${hazelnutSauce}`, name: specialProduct!.productName, icon: specialProduct!.icon, price: currentPrice, quantity, details: [{ label: 'Sabor', value: flavor }, { label: 'Salsa', value: hazelnutSauce ? 'Nutella (+$500)' : singleSauce }, ...(hazelnutSauce ? [{ label: 'Precio base', value: `+${formatPrice(specialProduct!.price)}` }] : [])] };
    } else if (kind === 'beverage') {
      item = { id: `beverage-${beverage}`, name: 'Bebida', icon: '🥤', price: specialProduct!.price, quantity, details: [{ label: 'Bebida', value: beverage }] };
    } else {
      item = { id: `hot-chocolate-${cacao}`, name: specialProduct!.productName, icon: '☕', price: specialProduct!.price, quantity, details: [{ label: 'Cacao', value: cacao }] };
    }
    onAdd(item);
  };

  return <div className="modal-backdrop" onClick={onClose}><div className="modal-card" onClick={(e) => e.stopPropagation()}>
    <div className="modal-header"><h3 className="modal-title">{modalTitles[kind]}</h3><button className="modal-close" onClick={onClose} aria-label="Cerrar"><X size={20} /></button></div>
    <div className="modal-image" style={{ backgroundImage: `url(${image})` }} />
    <div className="modal-body">
      {(kind === 'gelato' || kind === 'churros') && <div className="modal-section"><div className="modal-section-title">Presentación</div><div className="modal-options">{kind === 'gelato' ? gelatoSizes.map((s) => <button key={s.id} className={`modal-option ${sizeId === s.id ? 'active' : ''}`} onClick={() => { setSizeId(s.id); setFlavor(''); setSecondFlavor(''); setThirdFlavor(''); }}>{s.label} — {formatPrice(s.normalPrice)} normal / {formatPrice(s.steviaPrice)} Stevia</button>) : churrosSizes.map((s) => <button key={s.id} className={`modal-option ${sizeId === s.id ? 'active' : ''}`} onClick={() => setSizeId(s.id)}>{s.label} — {formatPrice(s.price)}</button>)}</div></div>}
      {kind === 'gelato' && <>{gelatoIsScoopSize ? <>{sizeId === 'simple' && renderScoopSelect('Bola 1', flavor, setFlavor)}{sizeId === 'doble' && <>{renderScoopSelect('Bola 1', flavor, setFlavor)}{renderScoopSelect('Bola 2', secondFlavor, setSecondFlavor)}</>}{sizeId === 'triple' && <>{renderScoopSelect('Bola 1', flavor, setFlavor)}{renderScoopSelect('Bola 2', secondFlavor, setSecondFlavor)}{renderScoopSelect('Bola 3', thirdFlavor, setThirdFlavor)}</>}</> : gelatoIsTubSize ? <>{renderScoopSelect('Sabor 1', flavor, setFlavor)}{renderScoopSelect('Sabor 2 (opcional)', secondFlavor, setSecondFlavor)}{renderScoopSelect('Sabor 3 (opcional)', thirdFlavor, setThirdFlavor)}</> : renderFlavorPicker('Elige tu sabor', flavor, 'first')}<div className="modal-section"><div className="modal-section-title">¿Quieres agregar adiciones?</div><div className="modal-options">{addOnOptions.map((a) => <button key={a} className={`modal-option ${addOns.includes(a) ? 'active' : ''}`} onClick={() => toggleAddOn(a)}>{a} +$300</button>)}</div></div></>}
      {(kind === 'churros' || kind === 'minichurros' || kind === 'filledChurro') && <div className="modal-section"><div className="modal-section-title">Tipo de azúcar</div><div className="modal-options">{sugarOptions.map((s) => <button key={s} className={`modal-option ${sugar === s ? 'active' : ''}`} onClick={() => setSugar(s)}>{s}</button>)}</div></div>}
      {kind === 'churros' && <><div className="modal-section"><div className="modal-section-title">Salsa 1</div><select className="modal-select" value={sauce1} onChange={(e) => setSauce1(e.target.value)}><option value="">Selecciona una salsa</option>{sauceOptions.map((s) => <option key={s}>{s}</option>)}</select></div><div className="modal-section"><div className="modal-section-title">Salsa 2</div><select className="modal-select" value={sauce2} onChange={(e) => setSauce2(e.target.value)}><option value="">Selecciona una salsa</option>{sauceOptions.map((s) => <option key={s}>{s}</option>)}</select></div><div className="modal-section"><div className="modal-section-title">¿Quieres agregar salsa de chocolate de avellana?</div><div className="modal-options"><button className={`modal-option ${!hazelnutSauce ? 'active' : ''}`} onClick={() => setHazelnutSauce(false)}>No agregar</button><button className={`modal-option ${hazelnutSauce ? 'active' : ''}`} onClick={() => setHazelnutSauce(true)}>Sí, agregar +$500</button></div></div></>}
      {kind === 'minichurros' && <><div className="modal-section"><div className="modal-section-title">Salsa</div><select className="modal-select" value={singleSauce} onChange={(e) => setSingleSauce(e.target.value)}><option value="">Selecciona una salsa</option>{sauceOptions.map((s) => <option key={s}>{s}</option>)}</select></div><div className="modal-section"><div className="modal-section-title">¿Quieres agregar salsa de chocolate de avellana?</div><div className="modal-options"><button className={`modal-option ${!hazelnutSauce ? 'active' : ''}`} onClick={() => setHazelnutSauce(false)}>No</button><button className={`modal-option ${hazelnutSauce ? 'active' : ''}`} onClick={() => setHazelnutSauce(true)}>Sí +$500</button></div></div></>}
      {kind === 'filledChurro' && null}
      {kind === 'cafe' && <><div className="modal-section"><div className="modal-section-title">Tamaño</div><div className="modal-options">{(['8 oz', '12 oz'] as const).map((sz) => <button key={sz} className={`modal-option ${coffeeSize === sz ? 'active' : ''}`} onClick={() => setCoffeeSize(sz)}>{sz} — {formatPrice(config.basePrice + (sz === '12 oz' ? 500 : 0))}</button>)}</div></div>{!['Café americano', 'Café en grano', 'Té'].includes(config.productName) && <div className="modal-section"><div className="modal-section-title">Tipo de leche</div><div className="modal-options">{milkOptions.map((m) => <button key={m} className={`modal-option ${milk === m ? 'active' : ''}`} onClick={() => setMilk(m)}>{m}</button>)}</div></div>}<div className="modal-section"><div className="modal-section-title">¿Cómo deseas endulzarlo?</div><div className="modal-options">{sweetenerOptions.map((s) => <button key={s} className={`modal-option ${sweetener === s ? 'active' : ''}`} onClick={() => setSweetener(s)}>{s}</button>)}</div></div></>}
      {isSpecial && <>{renderFlavorPicker('Elige el primer sabor', flavor, 'first')}{renderFlavorPicker('Elige el segundo sabor', secondFlavor, 'second')}<div className="modal-section"><div className="modal-section-title">Tipo de leche</div><div className="modal-options">{milkOptions.map((m) => <button key={m} className={`modal-option ${milk === m ? 'active' : ''}`} onClick={() => setMilk(m)}>{m}</button>)}</div></div><div className="modal-section"><div className="modal-section-title">¿Quieres chispas?</div><div className="modal-options">{sprinkleOptions.map((s) => <button key={s} className={`modal-option ${sprinkles === s ? 'active' : ''}`} onClick={() => setSprinkles(s)}>{s}</button>)}</div></div></>}
      {kind === 'singleFlavor' && <>{renderFlavorPicker('Elige 1 sabor', flavor, 'first')}<div className="modal-section"><div className="modal-section-title">Elige tu salsa</div><div className="modal-options">{['Chocolate', 'Caramelo', 'Manjar'].map((s) => <button key={s} className={`modal-option ${singleSauce === s ? 'active' : ''}`} onClick={() => { setSingleSauce(s); setHazelnutSauce(false); }}>{s}</button>)}<button className={`modal-option ${hazelnutSauce ? 'active' : ''}`} onClick={() => { setHazelnutSauce(true); setSingleSauce(''); }}>Nutella +$500</button></div></div></>}
      {kind === 'beverage' && <div className="modal-section"><div className="modal-section-title">Selecciona tu bebida</div><div className="modal-options">{beverageOptions.map((s) => <button key={s} className={`modal-option ${beverage === s ? 'active' : ''}`} onClick={() => setBeverage(s)}>{s}</button>)}</div></div>}
      {kind === 'hotChocolate' && <div className="modal-section"><div className="modal-section-title">Tipo de cacao</div><div className="modal-options">{['Cacao dulce', 'Cacao amargo'].map((s) => <button key={s} className={`modal-option ${cacao === s ? 'active' : ''}`} onClick={() => setCacao(s)}>{s}</button>)}</div></div>}
      {errorMessage && <p className="modal-error">{errorMessage}</p>}
    </div>
    <div className="modal-footer"><div className="modal-price"><small>Total</small><strong>{formatPrice(currentPrice * quantity)}</strong></div><div className="modal-quantity"><button onClick={() => setQuantity((q) => Math.max(1, q - 1))}><Minus size={14} /></button><span>{quantity}</span><button onClick={() => setQuantity((q) => q + 1)}><Plus size={14} /></button></div><div className="modal-actions"><button className="modal-cancel" onClick={onClose}>Cancelar</button><button className="button button--primary" onClick={handleAdd} disabled={!canAdd}>Agregar al carrito</button></div></div>
  </div></div>;
}

const formatPrice = (price: number) => `$${price.toLocaleString('es-CL')}`;
