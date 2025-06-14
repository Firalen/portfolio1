import { useState, useEffect } from 'react'
import Particles from './components/Particles'
import emailjs from '@emailjs/browser'

// Initialize EmailJS with your public key
emailjs.init({
  publicKey: "R_3EqsuGnGJey6NXk",
  limitRate: true
})

// EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: 'service_abc123', // TODO: Replace with your service ID from EmailJS dashboard
  templateId: 'template_1oo99f7',
  publicKey: 'R_3EqsuGnGJey6NXk'
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: false,
    message: ''
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Please enter your name'
      })
      return false
    }

    if (!formData.email.trim()) {
      setFormStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Please enter your email'
      })
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Please enter a valid email address'
      })
      return false
    }

    if (!formData.message.trim()) {
      setFormStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Please enter your message'
      })
      return false
    }

    if (formData.message.length < 10) {
      setFormStatus({
        submitting: false,
        success: false,
        error: true,
        message: 'Message must be at least 10 characters long'
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormStatus({ submitting: true, success: false, error: false, message: '' })

    if (!validateForm()) {
      return
    }

    try {
      const templateParams = {
        name: formData.name,
        message: formData.message,
        time: new Date().toLocaleString(),
        from_email: formData.email,
        reply_to: formData.email,
      }

      console.log('Sending email with params:', templateParams) // Debug log

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      )

      console.log('EmailJS Response:', response) // Debug log

      if (response.status === 200) {
        setFormStatus({
          submitting: false,
          success: true,
          error: false,
          message: 'Message sent successfully! I will get back to you soon.'
        })
        setFormData({ name: '', email: '', message: '' })
      } else {
        throw new Error(`Failed to send message: ${response.text}`)
      }
    } catch (error) {
      console.error('EmailJS Error:', error)
      setFormStatus({
        submitting: false,
        success: false,
        error: true,
        message: error.text || 'Failed to send message. Please try again later.'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Particles />
      
      {/* Mouse follower */}
      <div
        className="fixed w-8 h-8 rounded-full bg-blue-500/30 pointer-events-none z-50 transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 16}px, ${mousePosition.y - 16}px)`,
          mixBlendMode: 'screen'
        }}
      />

      {/* Navigation */}
      <nav className={`fixed w-full z-40 transition-all duration-300 ${
        isScrolled ? 'glass-effect shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gradient animate-pulse-slow">
             FIRAIF
            </h1>
            <div className="hidden md:flex space-x-8">
              {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
            <button 
              className="md:hidden text-gray-300 hover:text-white transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}>
            <div className="py-4 space-y-4">
              {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-gray-300 hover:text-white transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 backdrop-blur-3xl"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gradient animate-fade-in">
              Welcome to My Portfolio
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 animate-fade-in-delay">
              Full Stack Developer |  Problem Solver
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
              <a 
                href="#contact" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 glow-border"
              >
                Get in Touch
              </a>
              <a 
                href="#projects" 
                className="px-8 py-4 glass-effect text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                View Projects
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-gradient">
              About Me
            </h2>
            <div className="glass-effect rounded-2xl p-8 transform hover:scale-[1.02] transition-all duration-300 card-glow">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <p className="text-gray-300 leading-relaxed">
                    I'm a passionate developer with expertise in building modern web applications.
                    With a strong foundation in both frontend and backend technologies, I create
                    seamless user experiences and robust solutions.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    When I'm not coding, you can find me exploring new technologies,
                    contributing to open-source projects, or sharing my knowledge through
                    technical writing.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['React', 'Node.js', 'Python', 'AWS'].map((skill) => (
                    <div key={skill} className="glass-effect rounded-lg p-4 text-center hover:bg-blue-500/20 transition-all duration-300 hover-lift">
                      <span className="font-semibold text-white">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gradient">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project Card 1 */}
            <div className="group glass-effect rounded-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 card-glow">
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-4 text-white">Project One</h3>
                <p className="text-gray-300 mb-6">
                  A modern web application built with React and Node.js, featuring real-time updates and a beautiful UI.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['React', 'Node.js', 'MongoDB'].map((tech) => (
                    <span key={tech} className="px-3 py-1 glass-effect text-white rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300">
                    View Demo →
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-300 font-semibold transition-colors duration-300">
                    Source Code →
                  </a>
                </div>
              </div>
            </div>
            {/* Add more project cards with similar structure */}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gradient">
            Skills & Expertise
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: '💻', title: 'Frontend', skills: ['React', 'HTML', 'Next', 'Tailwind CSS','Typescript'] },
              { icon: '⚙️', title: 'Backend', skills: ['Node.js', 'Python', 'SQL','MongoDB','Express.js'] },
              { icon: '🎨', title: 'Design', skills: ['Figma', 'Adobe XD'] },
              { icon: '🚀', title: 'Tools', skills: ['Git', 'Docker', 'AWS'] }
            ].map((category) => (
              <div key={category.title} className="glass-effect rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 card-glow">
                <div className="text-4xl mb-4 animate-float">{category.icon}</div>
                <h3 className="font-semibold text-xl mb-4 text-white">{category.title}</h3>
                <ul className="space-y-2">
                  {category.skills.map((skill) => (
                    <li key={skill} className="text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gradient">
            Get in Touch
          </h2>
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="glass-effect rounded-2xl p-8 space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-300 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 glass-effect rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-300 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 glass-effect rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                  placeholder="Your email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-300 font-semibold mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 glass-effect rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                  placeholder="Your message"
                ></textarea>
              </div>
              {formStatus.message && (
                <div className={`p-4 rounded-lg ${
                  formStatus.success ? 'bg-green-500/20 text-green-300' : 
                  formStatus.error ? 'bg-red-500/20 text-red-300' : ''
                }`}>
                  {formStatus.message}
                </div>
              )}
              <button
                type="submit"
                disabled={formStatus.submitting}
                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 glow-border ${
                  formStatus.submitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {formStatus.submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-lg text-white py-12 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-6 text-gradient">
              Let's Connect
            </h3>
            <div className="flex justify-center space-x-8 mb-8">
              {['GitHub', 'LinkedIn', 'Twitter'].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300 hover-lift"
                >
                  {platform}
                </a>
              ))}
            </div>
            <p className="text-gray-400">© 2024 Your Name. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
