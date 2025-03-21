<template>
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h3>SunCar</h3>
                <p>선규와 함께하는 신나는 중고차거래</p>
            </div>
            <div class="footer-section">
                <h3>연락처</h3>
                <p>이메일: ysk9526@gmail.com</p>
                <p>전화: 010-1234-5678</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; {{ new Date().getFullYear() }} Suncar. All Rights Reserved.</p>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'FooterComponent'
}
</script>

<style>
.footer {
    background-color: #18191a;
    color: #ffffff;
    padding: 2rem 0 0 0;
}

.footer-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.footer-section {
    flex: 1;
    margin-bottom: 2rem;
    min-width: 200px;
}

.footer-section h3 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
}

.footer-section ul {
    list-style: none;
    padding: 0;
}

.footer-section li {
    margin-bottom: 0.5rem;
}

.footer-section a {
    color: #ffffff;
    text-decoration: none;
}

.footer-section a:hover {
    text-decoration: underline;
}

.footer-bottom {
    text-align: center;
    padding: 1rem 0;
    background-color: #1a2a3a;
}

.footer-bottom p {
    margin: 0;
    font-size: 0.9rem;
}
</style>