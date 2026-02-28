import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// First check the columns
const { data: sample, error: sampleErr } = await supabase
  .from('blog_posts')
  .select('*')
  .limit(1)

if (sampleErr) { console.error(sampleErr); process.exit(1) }
console.log('Columns:', Object.keys(sample[0]))

const { data, error } = await supabase
  .from('blog_posts')
  .select('*')
  .in('slug', ['ikuseshuro-article-005', 'ikuseshuro-special-001'])

if (error) { console.error(error); process.exit(1) }

fs.writeFileSync('/tmp/backup_articles.json', JSON.stringify(data, null, 2))
console.log('\nBacked up. IDs:')
data.forEach(d => console.log(` - ${d.slug}: id=${d.id}`))
const bodyKey = Object.keys(data[0] || {}).find(k => k.includes('body') || k.includes('content')) || 'body'
console.log(`\nUsing field: ${bodyKey}`)
console.log('\n--- article-005 preview ---')
console.log(data.find(d=>d.slug==='ikuseshuro-article-005')?.[bodyKey]?.slice(0,500))
console.log('\n--- special-001 preview ---')
console.log(data.find(d=>d.slug==='ikuseshuro-special-001')?.[bodyKey]?.slice(0,500))
