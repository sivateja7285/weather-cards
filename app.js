import React, { useState, useEffect, useRef } from 'react';

const h = React.createElement;

const LS_KEY = 'weatherCards_v1_react';

function uid(){ return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2,7); }

function load(){ try{ return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch(e){ return []; } }
function save(list){ localStorage.setItem(LS_KEY, JSON.stringify(list)); }

function timeAgo(ts){
  const diff = Math.floor((Date.now() - ts) / 60000);
  if (diff < 1) return 'just now';
  if (diff === 1) return '1 min ago';
  if (diff < 60) return `${diff} min ago`;
  const hours = Math.floor(diff/60);
  return hours === 1 ? '1 hour ago' : `${hours} hrs ago`;
}

function pickIcon(condition=''){
  const s = (condition||'').toLowerCase();
  if (s.includes('rain') || s.includes('drizzle')) return Icon({kind:'rain'});
  if (s.includes('snow')) return Icon({kind:'snow'});
  if (s.includes('fog') || s.includes('haze') || s.includes('mist')) return Icon({kind:'fog'});
  if (s.includes('cloud')) return Icon({kind:'cloud'});
  if (s.includes('thunder') || s.includes('storm')) return Icon({kind:'storm'});
  return Icon({kind:'sun'});
}

function Icon({kind}){
  const svgProps = { viewBox:"0 0 24 24", width:"36", height:"36", fill:"none", xmlns:"http://www.w3.org/2000/svg" };
  
  switch(kind){
    case 'rain': 
      return h('svg', svgProps,
        h('path', { d:"M20 16a4 4 0 0 0-3.8-4 5 5 0 0 0-9.4 1A3.5 3.5 0 0 0 8.5 20h11.5", stroke:"#0EA5A4", strokeWidth:"1.4", strokeLinecap:"round", strokeLinejoin:"round" }),
        h('g', { stroke:"#0891B2", strokeLinecap:"round", strokeWidth:"1.6" },
          h('path', { d:"M8 21v1" }),
          h('path', { d:"M11 19v3" }),
          h('path', { d:"M15 20v2" })
        )
      );
    case 'snow':
      return h('svg', svgProps,
        h('path', { d:"M6 13a6 6 0 0 1 12 0", stroke:"#60A5FA", strokeWidth:"1.4", strokeLinecap:"round" }),
        h('g', { stroke:"#3B82F6", strokeLinecap:"round", strokeWidth:"1.6" },
          h('path', { d:"M12 7v10" }),
          h('path', { d:"M9 10l6 4" }),
          h('path', { d:"M9 14l6-4" })
        )
      );
    case 'fog':
      return h('svg', svgProps,
        h('path', { d:"M3 11h18", stroke:"#9CA3AF", strokeWidth:"1.6", strokeLinecap:"round" }),
        h('path', { d:"M2 15h18", stroke:"#9CA3AF", strokeWidth:"1.6", strokeLinecap:"round" }),
        h('path', { d:"M4 7a6 6 0 0 1 16 0", stroke:"#6B7280", strokeWidth:"1.4", strokeLinecap:"round" })
      );
    case 'cloud':
      return h('svg', svgProps,
        h('path', { d:"M20 16H7a4 4 0 0 1 .5-7.9A5 5 0 0 1 17 6a5 5 0 0 1 3 9z", stroke:"#64748B", strokeWidth:"1.4", strokeLinecap:"round", strokeLinejoin:"round" })
      );
    case 'storm':
      return h('svg', svgProps,
        h('path', { d:"M18 13a4 4 0 0 0-3.8-4 5 5 0 0 0-9.4 1A3.5 3.5 0 0 0 6.5 17h11.5", stroke:"#0EA5A4", strokeWidth:"1.2", strokeLinecap:"round", strokeLinejoin:"round" }),
        h('path', { d:"M13 11l-3 5h4l-3 5", stroke:"#F97316", strokeWidth:"1.6", strokeLinecap:"round", strokeLinejoin:"round" })
      );
    default:
      return h('svg', svgProps,
        h('circle', { cx:"12", cy:"12", r:"4", fill:"#F59E0B" }),
        h('g', { stroke:"#FBBF24", strokeWidth:"1.2", strokeLinecap:"round" },
          h('path', { d:"M12 2v2" }),
          h('path', { d:"M12 20v2" }),
          h('path', { d:"M4.2 4.2l1.4 1.4" }),
          h('path', { d:"M18.4 18.4l1.4 1.4" }),
          h('path', { d:"M2 12h2" }),
          h('path', { d:"M20 12h2" }),
          h('path', { d:"M4.2 19.8l1.4-1.4" }),
          h('path', { d:"M18.4 5.6l1.4-1.4" })
        )
      );
  }
}

function formatTemp(v){ if (v === null || v === undefined || v === '') return '—'; return `${Math.round(Number(v))}°`; }
function formatNumber(v, digits=0){ if (v === null || v === undefined || v === '') return '—'; const n = Number(v); if (!Number.isFinite(n)) return '—'; return digits===0?Math.round(n):n.toFixed(digits); }

function App(){
  const [cards, setCards] = useState(()=>load());
  const [errors, setErrors] = useState('');
  const [form, setForm] = useState({ city:'', country:'', unit:'C', temp:'', feels:'', condition:'', humidity:'', wind:'' });
  const mounted = useRef(false);

  useEffect(()=>{ mounted.current = true; const t = setInterval(()=> setCards(c=>[...c]), 30000); return ()=>{ clearInterval(t); mounted.current=false; }; },[]);

  useEffect(()=>{ save(cards); }, [cards]);

  function handleChange(e){ const {name, value} = e.target; setForm(f=>({...f, [name]: value })); }

  function validate(){ const errs = []; if (!form.city.trim()) errs.push('City is required.'); ['temp','feels','humidity','wind'].forEach(k=>{ const v=form[k].trim(); if (v && isNaN(Number(v))) errs.push(`${k[0].toUpperCase()+k.slice(1)} must be a number.`); }); return errs; }

  function handleAdd(e){ 
    e.preventDefault(); 
    setErrors(''); 
    const errs = validate(); 
    if (errs.length){ setErrors(errs.join(' ')); return; }
    const item = { 
      id: uid(), 
      city: form.city.trim(), 
      country: form.country.trim().toUpperCase(), 
      unit: form.unit, 
      temp: form.temp.trim()?Math.round(Number(form.temp)):null, 
      feels: form.feels.trim()?Math.round(Number(form.feels)):null, 
      condition: form.condition.trim(), 
      humidity: form.humidity.trim()?Math.round(Number(form.humidity)):null, 
      wind: form.wind.trim()?parseFloat(Number(form.wind).toFixed(1)):null, 
      updatedAt: Date.now() 
    };
    setCards(c=>[item, ...c]);
    setForm({ city:'', country:'', unit:form.unit, temp:'', feels:'', condition:'', humidity:'', wind:'' });
    setTimeout(()=> document.getElementById('city')?.focus(), 30);
  }

  function handleRemove(id){ if (!confirm('Remove this card?')) return; setCards(c=>c.filter(x=>x.id!==id)); }
  function handleClear(){ if (!confirm('Clear all cards? This cannot be undone.')) return; setCards([]); }

  return h('div', { className: 'container' },
    h('h1', { className: 'title' }, 'Weather Cards'),
    h('form', { id: 'weather-form', className: 'form', onSubmit: handleAdd, noValidate: true },
      h('fieldset', { className: 'group' },
        h('legend', null, 'Location'),
        h('div', { className: 'row' },
          h('label', { className: 'field' },
            h('span', null, 'City*'),
            h('input', { id: 'city', name: 'city', value: form.city, onChange: handleChange, required: true })
          ),
          h('label', { className: 'field' },
            h('span', null, 'Country'),
            h('input', { id: 'country', name: 'country', value: form.country, onChange: handleChange, maxLength: 5, placeholder: 'US' })
          )
        )
      ),
      h('fieldset', { className: 'group' },
        h('legend', null, 'Temperature'),
        h('div', { className: 'row' },
          h('label', { className: 'field small' },
            h('span', null, 'Unit'),
            h('select', { id: 'unit', name: 'unit', value: form.unit, onChange: handleChange, 'aria-label': 'Unit' },
              h('option', { value: 'C' }, '°C'),
              h('option', { value: 'F' }, '°F')
            )
          ),
          h('label', { className: 'field' },
            h('span', null, 'Temperature'),
            h('input', { name: 'temp', value: form.temp, onChange: handleChange, inputMode: 'numeric', placeholder: 'e.g. 18' })
          ),
          h('label', { className: 'field' },
            h('span', null, 'Feels like'),
            h('input', { name: 'feels', value: form.feels, onChange: handleChange, inputMode: 'numeric', placeholder: 'e.g. 16' })
          )
        )
      ),
      h('fieldset', { className: 'group' },
        h('legend', null, 'Details'),
        h('div', { className: 'row' },
          h('label', { className: 'field' },
            h('span', null, 'Condition'),
            h('input', { name: 'condition', value: form.condition, onChange: handleChange, placeholder: 'e.g. Rain, Haze, Clear' })
          ),
          h('label', { className: 'field small' },
            h('span', null, 'Humidity %'),
            h('input', { name: 'humidity', value: form.humidity, onChange: handleChange, inputMode: 'numeric', placeholder: 'e.g. 72' })
          ),
          h('label', { className: 'field small' },
            h('span', null, 'Wind'),
            h('input', { name: 'wind', value: form.wind, onChange: handleChange, inputMode: 'numeric', placeholder: 'e.g. 3.5' })
          )
        )
      ),
      h('div', { className: 'controls' },
        h('div', { className: 'errors', 'aria-live': 'polite' }, errors),
        h('div', { className: 'buttons' },
          h('button', { className: 'btn primary', type: 'submit' }, 'Add'),
          h('button', { type: 'button', className: 'btn ghost', onClick: handleClear }, 'Clear All')
        )
      )
    ),
    h('section', { id: 'grid-area' },
      cards.length === 0 ? 
        h('div', { id: 'empty-state', className: 'empty' },
          h('div', { className: 'empty-inner' },
            h('h2', null, 'No weather cards yet'),
            h('p', null, 'Use the form above to add a city. Cards persist locally — refresh the page and they\'ll remain.'),
            h('p', { className: 'hint' }, 'Try: "Seattle, US, °C, 12, 11, Rain, 87, 4.2"')
          )
        ) : null,
      h('div', { id: 'cards', className: 'grid', 'aria-live': 'polite' },
        ...cards.map(item =>
          h('article', { key: item.id, className: 'card', 'data-id': item.id },
            h('div', { className: 'card-head' },
              h('div', { className: 'cond' },
                h('div', { className: 'icon' }, pickIcon(item.condition)),
                h('div', null,
                  h('div', { className: 'city long' }, `${item.city}${item.country ? `, ${item.country}` : ''}`),
                  h('div', { className: 'meta' }, item.condition || '—')
                )
              ),
              h('div', { className: 'temp' },
                formatTemp(item.temp),
                h('span', { className: 'meta', style: { fontSize: '0.6rem', marginLeft: 6 } }, item.unit)
              )
            ),
            h('div', { className: 'card-body' },
              h('div', { className: 'kv' },
                h('span', null, 'Feels like'),
                h('strong', null, formatNumber(item.feels))
              ),
              h('div', { className: 'kv' },
                h('span', null, 'Humidity'),
                h('strong', null, item.humidity !== null ? formatNumber(item.humidity) + '%' : '—')
              ),
              h('div', { className: 'kv' },
                h('span', null, 'Wind'),
                h('strong', null, item.wind !== null ? formatNumber(item.wind, 1) + ' m/s' : '—')
              )
            ),
            h('div', { className: 'card-actions' },
              h('div', { className: 'time', 'data-ts': item.updatedAt }, timeAgo(item.updatedAt)),
              h('button', { className: 'remove', onClick: () => handleRemove(item.id) }, 'Remove')
            )
          )
        )
      )
    )
  );
}

export default App;
