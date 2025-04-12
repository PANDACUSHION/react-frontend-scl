import React from 'react';
import { Bell, Shield, ChartBar, Clock, Users, Activity, Check, Camera } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="bg-base-100 pt-10">
            {/* Hero Section */}
            <section className="hero min-h-96 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="hero-content flex-col lg:flex-row-reverse gap-8 py-12">
                    <div className="lg:w-1/2">
                        <div className="mockup-window border bg-base-300">
                            <div className="bg-base-200 relative overflow-hidden">
                                <img src="/api/placeholder/800/450" alt="Classroom detection dashboard" className="w-full h-64 object-cover" />
                                <div className="absolute top-2 right-2 badge badge-accent badge-lg">Live</div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-1/2">
                        <h1 className="text-5xl font-bold mb-4">Smart Classroom Detection System</h1>
                        <p className="text-xl mb-8">Enhance learning environments with intelligent monitoring, attendance tracking, and behavior analysis.</p>
                        <div className="flex flex-wrap gap-3">
                            <button className="btn btn-primary btn-lg">Get Started</button>
                            <button className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-indigo-600">Watch Demo</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-6 bg-base-200">
                <div className="container mx-auto">
                    <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                        <div className="stat">
                            <div className="stat-figure text-primary">
                                <Users size={28} />
                            </div>
                            <div className="stat-title">Schools</div>
                            <div className="stat-value text-primary">1,200+</div>
                            <div className="stat-desc">Using our system daily</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <Camera size={28} />
                            </div>
                            <div className="stat-title">Classrooms</div>
                            <div className="stat-value text-secondary">24,000+</div>
                            <div className="stat-desc">Monitored in real-time</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-accent">
                                <Activity size={28} />
                            </div>
                            <div className="stat-title">Detection Accuracy</div>
                            <div className="stat-value text-accent">99.7%</div>
                            <div className="stat-desc">Industry-leading precision</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
                        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">Our classroom detection system combines advanced AI with easy-to-use interfaces to transform educational monitoring.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Feature cards... (keep all other feature cards the same) */}

                        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
                            <div className="card-body">
                                <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center mb-4">
                                    <Activity className="text-warning" size={24} />
                                </div>
                                <h3 className="card-title text-xl">AI-Powered Insights</h3>
                                <p>Leverage machine learning algorithms that continuously improve classroom monitoring accuracy and effectiveness.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* How It Works */}
            <section id="how-it-works" className="py-16 bg-base-200">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">Simple implementation, powerful results - get your classroom detection system running in just a few steps.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 justify-center">
                        <div className="card bg-base-100 shadow-xl md:w-1/3">
                            <div className="card-body items-center text-center">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4 text-white font-bold text-xl">1</div>
                                <h3 className="card-title text-xl">Install</h3>
                                <p>Setup our unobtrusive camera systems in your classrooms with plug-and-play installation.</p>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl md:w-1/3">
                            <div className="card-body items-center text-center">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4 text-white font-bold text-xl">2</div>
                                <h3 className="card-title text-xl">Configure</h3>
                                <p>Customize detection parameters and reporting preferences through our intuitive dashboard.</p>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl md:w-1/3">
                            <div className="card-body items-center text-center">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4 text-white font-bold text-xl">3</div>
                                <h3 className="card-title text-xl">Monitor</h3>
                                <p>Access real-time data and insights from anywhere, on any device, whenever you need it.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">What Educators Say</h2>
                        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">Join thousands of satisfied educational institutions already transforming their classroom management.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex mb-4">
                                    <div className="rating">
                                        <input type="radio" className="mask mask-star-2 bg-orange-400" checked readOnly />
                                        <input type="radio" className="mask mask-star-2 bg-orange-400" checked readOnly />
                                        <input type="radio" className="mask mask-star-2 bg-orange-400" checked readOnly />
                                        <input type="radio" className="mask mask-star-2 bg-orange-400" checked readOnly />
                                        <input type="radio" className="mask mask-star-2 bg-orange-400" checked readOnly />
                                    </div>
                                </div>
                                <p className="italic">"The detection system has revolutionized how we track attendance and student engagement. What used to take hours now happens automatically."</p>
                                <div className="flex items-center mt-4">
                                    <div className="avatar placeholder mr-4">
                                        <div className="bg-neutral text-neutral-content rounded-full w-12">
                                            <span>JD</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold">Dr. Jane Davis</p>
                                        <p className="text-sm">Principal, Lincoln High School</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex mb-4">
                                    <div className="rating">
                                        <input type="radio" className="mask mask-star-2 bg-orange-400" checked readOnly />
                                        <input type="radio" className="mask mask-star-2 bg-orange-400" checked readOnly />
                                        <input type="radio" className="mask mask-star-2 bg-orange-400" checked readOnly />
                                        <input type="radio" className="mask mask-star-2 bg-orange-400" checked readOnly />
                                        <input type="radio" className="mask mask-star-2 bg-orange-400" checked readOnly />
                                    </div>
                                </div>
                                <p className="italic">"The insights from the engagement analytics have completely transformed our teaching methods. We've seen a 32% increase in student participation."</p>
                                <div className="flex items-center mt-4">
                                    <div className="avatar placeholder mr-4">
                                        <div className="bg-neutral text-neutral-content rounded-full w-12">
                                            <span>RM</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold">Prof. Robert Miller</p>
                                        <p className="text-sm">Department Head, Westfield University</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex mb-4">
                                    <div className="rating">
                                        <input type="radio" className="mask mask-star-2 bg-orange-400" checked readOnly />
                                        <input type="radio" className="mask mask-star-2 bg-orange-400" checked readOnly />
                                        <input type="radio" className="mask mask-star-2 bg-orange-400" checked readOnly />
                                        <input type="radio" className="mask mask-star-2 bg-orange-400" checked readOnly />
                                        <input type="radio" className="mask mask-star-2 bg-orange-400" checked readOnly />
                                    </div>
                                </div>
                                <p className="italic">"Implementation was seamless and the support has been outstanding. The privacy features give us and parents peace of mind while improving our operations."</p>
                                <div className="flex items-center mt-4">
                                    <div className="avatar placeholder mr-4">
                                        <div className="bg-neutral text-neutral-content rounded-full w-12">
                                            <span>SW</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold">Sarah Wong</p>
                                        <p className="text-sm">Technology Director, Oakridge Schools</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-16 bg-base-200">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">Choose the plan that fits your institution's needs, with no hidden fees.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 justify-center">
                        <div className="card bg-base-100 shadow-xl lg:w-1/4">
                            <div className="card-body">
                                <h3 className="card-title text-2xl justify-center">Starter</h3>
                                <div className="text-center my-4">
                                    <span className="text-4xl font-bold">$299</span>
                                    <span className="text-base-content/70">/month</span>
                                </div>
                                <p className="text-center text-base-content/70 mb-4">Perfect for small schools with up to 10 classrooms</p>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center">
                                        <Check size={18} className="text-success mr-2" />
                                        <span>Attendance tracking</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check size={18} className="text-success mr-2" />
                                        <span>Basic analytics</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check size={18} className="text-success mr-2" />
                                        <span>Email reports</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check size={18} className="text-success mr-2" />
                                        <span>8/5 support</span>
                                    </li>
                                </ul>
                                <div className="card-actions justify-center mt-auto">
                                    <button className="btn btn-outline btn-primary btn-block">Choose Starter</button>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-primary text-primary-content shadow-xl lg:w-1/4 lg:scale-105">
                            <div className="card-body">
                                <div className="badge badge-secondary mx-auto mb-2">Most Popular</div>
                                <h3 className="card-title text-2xl justify-center">Professional</h3>
                                <div className="text-center my-4">
                                    <span className="text-4xl font-bold">$699</span>
                                    <span>/month</span>
                                </div>
                                <p className="text-center mb-4">Ideal for medium-sized schools with up to 30 classrooms</p>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center">
                                        <Check size={18} className="mr-2" />
                                        <span>Everything in Starter</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check size={18} className="mr-2" />
                                        <span>Advanced engagement analytics</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check size={18} className="mr-2" />
                                        <span>Behavioral insights</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check size={18} className="mr-2" />
                                        <span>API access</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check size={18} className="mr-2" />
                                        <span>24/7 priority support</span>
                                    </li>
                                </ul>
                                <div className="card-actions justify-center mt-auto">
                                    <button className="btn btn-secondary btn-block">Choose Professional</button>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl lg:w-1/4">
                            <div className="card-body">
                                <h3 className="card-title text-2xl justify-center">Enterprise</h3>
                                <div className="text-center my-4">
                                    <span className="text-4xl font-bold">Custom</span>
                                </div>
                                <p className="text-center text-base-content/70 mb-4">For large institutions with unique requirements</p>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center">
                                        <Check size={18} className="text-success mr-2" />
                                        <span>Everything in Professional</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check size={18} className="text-success mr-2" />
                                        <span>Custom integrations</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check size={18} className="text-success mr-2" />
                                        <span>Dedicated account manager</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check size={18} className="text-success mr-2" />
                                        <span>On-premise installation options</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check size={18} className="text-success mr-2" />
                                        <span>SLA guarantees</span>
                                    </li>
                                </ul>
                                <div className="card-actions justify-center mt-auto">
                                    <button className="btn btn-outline btn-primary btn-block">Contact Sales</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Classrooms?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">Join the thousands of educational institutions already benefiting from intelligent classroom detection technology.</p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button className="btn btn-lg btn-secondary">Schedule a Demo</button>
                        <button className="btn btn-lg btn-outline text-white border-white hover:bg-white hover:text-indigo-600">Contact Us</button>
                    </div>
                </div>
            </section>
        </div>
    );
}