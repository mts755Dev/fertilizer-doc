-- Create quiz_responses table for fertility assessment quiz
CREATE TABLE IF NOT EXISTS quiz_responses (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    gender VARCHAR(10) DEFAULT 'mr',
    quiz_answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_quiz_responses_email ON quiz_responses(email);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_created_at ON quiz_responses(created_at);

-- Create clinic_reviews table for clinic reviews
CREATE TABLE IF NOT EXISTS clinic_reviews (
    id BIGSERIAL PRIMARY KEY,
    clinic_id BIGINT NOT NULL,
    clinic_slug VARCHAR(255) NOT NULL,
    clinic_type VARCHAR(50) DEFAULT 'fertility',
    reviewer_name VARCHAR(100),
    reviewer_email VARCHAR(255),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_title VARCHAR(255),
    review_content TEXT NOT NULL,
    review_date DATE NOT NULL,
    treatment_date DATE,
    treatment_type VARCHAR(100),
    cost_range VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for clinic_reviews
CREATE INDEX IF NOT EXISTS idx_clinic_reviews_clinic_id ON clinic_reviews(clinic_id);
CREATE INDEX IF NOT EXISTS idx_clinic_reviews_clinic_slug ON clinic_reviews(clinic_slug);
CREATE INDEX IF NOT EXISTS idx_clinic_reviews_status ON clinic_reviews(status);
CREATE INDEX IF NOT EXISTS idx_clinic_reviews_rating ON clinic_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_clinic_reviews_created_at ON clinic_reviews(created_at);

-- Create blog_posts table for blog functionality
CREATE TABLE IF NOT EXISTS blog_posts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    featured_image_url TEXT,
    category VARCHAR(100) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    reading_time_minutes INTEGER DEFAULT 5,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    blog_type VARCHAR(50) DEFAULT 'fertility',
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for blog_posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_blog_type ON blog_posts(blog_type);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_quiz_responses_updated_at 
    BEFORE UPDATE ON quiz_responses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clinic_reviews_updated_at 
    BEFORE UPDATE ON clinic_reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample blog posts for fertility
INSERT INTO blog_posts (title, slug, excerpt, content, author_name, category, tags, reading_time_minutes, status, blog_type) VALUES
(
    'Understanding IVF: A Complete Guide to In Vitro Fertilization',
    'understanding-ivf-complete-guide',
    'Learn everything you need to know about IVF treatment, from the process and success rates to costs and what to expect.',
    '# Understanding IVF: A Complete Guide to In Vitro Fertilization

In vitro fertilization (IVF) is one of the most effective fertility treatments available today. This comprehensive guide will walk you through everything you need to know about the IVF process.

## What is IVF?

IVF is a fertility treatment where eggs are retrieved from the ovaries and fertilized with sperm in a laboratory. The resulting embryos are then transferred to the uterus.

## The IVF Process

### 1. Ovarian Stimulation
The first step involves taking fertility medications to stimulate the ovaries to produce multiple eggs.

### 2. Egg Retrieval
Once the eggs are mature, they are retrieved through a minor surgical procedure.

### 3. Fertilization
The eggs are combined with sperm in the laboratory for fertilization.

### 4. Embryo Transfer
The best embryos are selected and transferred to the uterus.

## Success Rates

IVF success rates vary based on several factors:
- Age of the woman
- Quality of eggs and sperm
- Underlying fertility issues
- Clinic expertise

## Costs

IVF costs typically range from $12,000 to $25,000 per cycle, depending on the clinic and location.',
    'Dr. Sarah Johnson',
    'IVF Treatment',
    ARRAY['IVF', 'fertility treatment', 'in vitro fertilization', 'success rates'],
    8,
    'published',
    'fertility'
),
(
    'Fertility Diet: Foods That Boost Your Chances of Conception',
    'fertility-diet-foods-boost-conception',
    'Discover the best foods and nutrients that can improve your fertility and increase your chances of getting pregnant naturally.',
    '# Fertility Diet: Foods That Boost Your Chances of Conception

Your diet plays a crucial role in fertility. What you eat can significantly impact your reproductive health and chances of conception.

## Key Nutrients for Fertility

### Folic Acid
Essential for preventing birth defects and supporting healthy egg development.

**Best sources:** Leafy greens, fortified cereals, beans

### Omega-3 Fatty Acids
Help regulate hormones and improve egg quality.

**Best sources:** Fatty fish, walnuts, flaxseeds

### Antioxidants
Protect eggs and sperm from damage.

**Best sources:** Berries, nuts, dark chocolate

## Foods to Include

1. **Leafy Greens** - Rich in folic acid and iron
2. **Fatty Fish** - High in omega-3s
3. **Nuts and Seeds** - Good source of healthy fats
4. **Whole Grains** - Provide complex carbohydrates
5. **Lean Proteins** - Essential for hormone production

## Foods to Avoid

- Processed foods high in trans fats
- Excessive caffeine
- Alcohol
- High-mercury fish

## Sample Fertility Diet Plan

**Breakfast:** Oatmeal with berries and walnuts
**Lunch:** Salmon salad with leafy greens
**Dinner:** Grilled chicken with quinoa and vegetables
**Snacks:** Greek yogurt with almonds',
    'Dr. Michael Chen',
    'Fertility Tips',
    ARRAY['fertility diet', 'nutrition', 'conception', 'healthy eating'],
    6,
    'published',
    'fertility'
),
(
    'Age and Fertility: Understanding the Biological Clock',
    'age-fertility-biological-clock',
    'Learn how age affects fertility in both men and women, and what you can do to optimize your chances of conception.',
    '# Age and Fertility: Understanding the Biological Clock

Age is one of the most significant factors affecting fertility. Understanding how age impacts reproductive health can help you make informed decisions about family planning.

## Female Fertility and Age

### Fertility Decline Timeline
- **20s:** Peak fertility years
- **30-35:** Gradual decline begins
- **35-40:** More significant decline
- **40+:** Rapid decline in fertility

### Why Fertility Declines with Age
- Decreased egg quantity and quality
- Increased risk of chromosomal abnormalities
- Changes in hormone levels
- Reduced ovarian reserve

## Male Fertility and Age

While men can father children at older ages, sperm quality does decline:
- Decreased sperm motility
- Increased DNA fragmentation
- Higher risk of genetic mutations

## Optimizing Fertility at Any Age

### Lifestyle Factors
- Maintain a healthy weight
- Exercise regularly
- Avoid smoking and excessive alcohol
- Manage stress levels

### Medical Interventions
- Fertility testing
- Timed intercourse
- Fertility treatments (IUI, IVF)
- Egg freezing (for women)

## When to Seek Help

Consider consulting a fertility specialist if:
- Under 35: Trying for 12 months
- 35-40: Trying for 6 months
- Over 40: Trying for 3 months

## Success Stories

Many couples successfully conceive at older ages with the right support and treatment.',
    'Dr. Emily Rodriguez',
    'Fertility Education',
    ARRAY['age and fertility', 'biological clock', 'fertility decline', 'family planning'],
    7,
    'published',
    'fertility'
);

-- Create RLS (Row Level Security) policies
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Quiz responses: Allow insert for all, read for authenticated users
CREATE POLICY "Allow insert quiz responses" ON quiz_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read quiz responses" ON quiz_responses FOR SELECT USING (auth.role() = 'authenticated');

-- Clinic reviews: Allow insert for all, read for all, update/delete for admin
CREATE POLICY "Allow insert clinic reviews" ON clinic_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read clinic reviews" ON clinic_reviews FOR SELECT USING (true);
CREATE POLICY "Allow update clinic reviews" ON clinic_reviews FOR UPDATE USING (auth.role() = 'service_role');

-- Blog posts: Allow read for all, insert/update/delete for admin
CREATE POLICY "Allow read blog posts" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow insert blog posts" ON blog_posts FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Allow update blog posts" ON blog_posts FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Allow delete blog posts" ON blog_posts FOR DELETE USING (auth.role() = 'service_role');

-- Add comments for documentation
COMMENT ON TABLE quiz_responses IS 'Stores fertility assessment quiz responses from users';
COMMENT ON TABLE clinic_reviews IS 'Stores user reviews for fertility clinics';
COMMENT ON TABLE blog_posts IS 'Stores blog posts for fertility education and information'; 